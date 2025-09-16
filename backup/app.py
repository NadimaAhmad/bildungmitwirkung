# app.py
from flask import Flask, render_template, request, redirect, url_for
import pandas as pd
import matplotlib.pyplot as plt
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static'

# Pastikan folder untuk simpan plot
os.makedirs('static', exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            return redirect(request.url)
        if file and file.filename.endswith('.csv'):
            # Baca CSV
            df = pd.read_csv(file)
            head_data = df.head().to_html(classes="table table-striped table-hover", index=False)
            desc_data = df.describe().transpose().to_html(classes="table table-bordered", table_id="desc-table")

            # Buat plot distribusi kolom numerik pertama
            numeric_cols = df.select_dtypes(include='number').columns
            if len(numeric_cols) > 0:
                plt.figure(figsize=(8, 5))
                df[numeric_cols[0]].dropna().hist(bins=20, color='skyblue', edgecolor='black')
                plt.title(f"Distribusi {numeric_cols[0]}")
                plt.xlabel(numeric_cols[0])
                plt.ylabel("Frekuensi")
                plot_path = os.path.join('static', 'plot.png')
                plt.savefig(plot_path, bbox_inches='tight')
                plt.close()
                plot_url = url_for('static', filename='plot.png')
            else:
                plot_url = None

            return render_template('index.html',
                                   head_data=head_data,
                                   desc_data=desc_data,
                                   plot_url=plot_url,
                                   show_results=True)
    return render_template('index.html', show_results=False)

if __name__ == '__main__':
    app.run(debug=True)
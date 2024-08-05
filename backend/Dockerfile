# ベースイメージ
FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 作業ディレクトリを設定
WORKDIR /usr/src/app/

# 必要なパッケージをインストール
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# プロジェクトファイルをコピー
COPY . .

# ポートを公開
EXPOSE 8000

# コマンドを実行
CMD ["sh", "-c", "django-admin startproject django_project && python manage.py migrate"]
#CMD ["sh", "-c", "django-admin startproject django_project && python manage.py startapp accounts && python manage.py startapp notes"]

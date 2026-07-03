FROM python
WORKDIR /Commerce
COPY  requirements.txt .
RUN pip install -r  requirements.txt
COPY . .
CMD ["python", "app.py"]

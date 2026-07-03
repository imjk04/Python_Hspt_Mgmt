# app.py
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Sample data for demonstration
patients = [
    {"id": "P-1024", "name": "Sarah Johnson", "doctor": "Dr. Emily Chen", "status": "Recovered", "last_visit": "2026-06-28"},
    {"id": "P-1023", "name": "Michael Torres", "doctor": "Dr. Robert Kim", "status": "In treatment", "last_visit": "2026-06-30"},
    {"id": "P-1022", "name": "Lisa Park", "doctor": "Dr. James Okafor", "status": "Critical", "last_visit": "2026-07-01"},
    {"id": "P-1021", "name": "David Miller", "doctor": "Dr. Sarah Lee", "status": "Discharged", "last_visit": "2026-06-25"},
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/patients', methods=['GET'])
def get_patients():
    return jsonify(patients)

@app.route('/api/patients', methods=['POST'])
def add_patient():
    data = request.get_json()
    # In a real app, you would save to database
    new_patient = {
        "id": f"P-{len(patients) + 1025}",
        "name": data.get('name'),
        "doctor": data.get('doctor', 'Unassigned'),
        "status": data.get('status', 'New'),
        "last_visit": data.get('last_visit', '2026-07-03')
    }
    patients.insert(0, new_patient)
    return jsonify(new_patient), 201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

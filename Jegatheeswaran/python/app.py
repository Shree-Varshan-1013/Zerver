from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import random
import time

app = Flask(__name__)
socketio = SocketIO(app)
import os

@app.route('/')
def index():
    template_path = os.path.join(os.path.dirname(__file__), 'templates', 'index.html')
    return render_template(template_path)


# @app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

def generate_data():
    while True:
        time.sleep(1)  # Simulate some processing time
        data = random.randint(1, 100)
        socketio.emit('message', data)  # Emit the data to all connected clients

if __name__ == '__main__':
    socketio.start_background_task(generate_data)
    socketio.run(app, debug=True)

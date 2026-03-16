"""
Main entry point for starting the Flask application.
"""
from app import create_app

app = create_app()

if __name__ == '__main__':
    # Run the server on port 5001 to avoid macOS ControlCenter conflict
    app.run(debug=True, port=5001)

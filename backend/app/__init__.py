import os
from flask import Flask
from dotenv import load_dotenv

def create_app():
    """
    Create and configure the Flask application.
    """
    # Load environment variables from .env
    load_dotenv()
    app = Flask(__name__, static_folder=None)
    
    from .routes import bp as main_bp
    app.register_blueprint(main_bp)
    
    return app

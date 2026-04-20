from src import create_app

# creating the app from function that is creating from the __init__.py file
app = create_app()

if __name__ == "__main__":
    app.run(debug=False)

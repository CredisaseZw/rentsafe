# RentSafe

## Getting Started

1. Clone the repo

   ```sh
   git clone https://github.com/barwa95/tempRentSafe.git
   ```

2. Navigate to `tempRentSafe` directory:

    ```sh
    cd tempRentSafe
    ```

3. Install Node dependencies

    ```sh
    npm install
    ```

4. Open a new terminal and navigate to `tempRentSafe` directory:

    ```sh
    cd tempRentSafe
    ```

5. Create a Python virtual environment

    ```sh
    python -m venv env
    ```

6. Activate the virtual environment

    ```sh
    source env/bin/activate
    ```

7. Install Python dependencies

    ```sh
    pip install -r requirements.txt
    ```

8. Migrate the database

    ```sh
    python manage.py migrate
    ```

9. In the first terminal, run the React app

    ```sh
    npm run vite-dev
    ```

10. In the second terminal, run the Django server

    ```sh
    python manage.py runserver
    ```

11. Open the app in your browser at `http://localhost:8000/`
# credisafe

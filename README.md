# Application to show information from water bed meters

http://www.hel.fi/www/Helsinki/fi/asuminen-ja-ymparisto/tontit/maa-ja-kalliopera/pohjavesi/

## Installation

 * git clone the project
 * cd geowaterbed
 * create a virtual environment for Python if you don't want to crowd your system Python
   * virtualenv geowaterbed_env
   * source geowaterbed_env/bin/activate
   * or just use geowaterbed_env/bin/python instead of system Python
 * pip install -r requirements.txt installs packages for production use
 * pip install -r dev_requirements.txt installs above and also helpful packages for development
 * edit projekti/projekti/local_settings.py to your database settings or set the expected values in your environment variables
 * cd projekti
 * python manage.py migrate creates the Django tables into database
 * python manage.py createsuperuser creates full admin user for the project's administration site
 * python manage.py runserver starts a development server at http://localhost:8000 but you can change that as per documentation (python manage.py help)


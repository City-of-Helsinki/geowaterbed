
from django.core.management.base import BaseCommand, CommandError
from app.observator import import_data


class Command(BaseCommand):
    help = 'Imports new observations'

    def handle(self, *args, **options):
        import_data()

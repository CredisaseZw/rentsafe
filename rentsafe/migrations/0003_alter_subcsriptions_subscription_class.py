# Generated by Django 5.0.6 on 2025-03-07 08:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rentsafe', '0002_commshistmessage_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subcsriptions',
            name='subscription_class',
            field=models.CharField(choices=[('individual', 'individual'), ('company', 'company'), ('combined', 'combined')], max_length=10),
        ),
    ]

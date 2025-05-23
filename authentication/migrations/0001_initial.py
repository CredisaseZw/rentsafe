# Generated by Django 4.1.1 on 2024-04-04 09:36

import authentication.manager
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.CharField(max_length=50, unique=True)),
                ('user_id', models.CharField(default='00', max_length=50, null=True, unique=True, verbose_name='username')),
                ('individual', models.CharField(default=0, max_length=255, verbose_name='individual_id')),
                ('company', models.CharField(max_length=255, verbose_name='company_id')),
                ('user_type', models.PositiveSmallIntegerField(choices=[(1, 'client'), (2, 'company'), (3, 'agent'), (4, 'individual')], default=1)),
                ('date_joined', models.DateTimeField(auto_now_add=True, verbose_name='date joined')),
                ('is_active', models.BooleanField(default=True, verbose_name='is_active')),
                ('is_superuser', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False, verbose_name='staff')),
                ('last_login', models.DateTimeField(null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'db_table': 'users',
            },
            managers=[
                ('objects', authentication.manager.CustomUserManager()),
            ],
        ),
    ]

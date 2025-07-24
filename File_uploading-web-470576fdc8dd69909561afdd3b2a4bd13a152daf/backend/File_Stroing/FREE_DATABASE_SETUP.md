# Free Database Setup Options

## Option 1: db4free.net (Recommended)
1. Go to https://db4free.net/signup.php
2. Create account with these details:
   - Database Name: filehub_db
   - Username: your_username
   - Password: your_password
   - Email: your_email

3. Database Connection Details:
   - Host: db4free.net
   - Port: 3306
   - Database: filehub_db
   - Username: your_username
   - Password: your_password

4. Connection URL Format:
   ```
   mysql://username:password@db4free.net:3306/filehub_db
   ```

## Option 2: FreeSQLDatabase.com
1. Go to https://freesqldatabase.com/
2. Create free MySQL database
3. Get connection details

## Option 3: PlanetScale (Free Tier)
1. Go to https://planetscale.com/
2. Sign up for free account
3. Create database
4. Get connection string

## For Render Deployment:
1. Use any of the above database URLs
2. Set as DATABASE_URL environment variable in Render
3. Format: mysql://username:password@host:port/database_name

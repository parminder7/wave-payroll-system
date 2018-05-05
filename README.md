# Quick demo 

![demo-wave mov](https://user-images.githubusercontent.com/7086220/39659564-dbe7f726-4ff8-11e8-8a29-15e9b428bb46.gif)

# Design wave-payroll-system

<img width="730" alt="screen shot 2018-04-29 at 10 30 10 pm" src="https://user-images.githubusercontent.com/7086220/39658848-e0637960-4fe9-11e8-81e4-edefa9a1cc4b.png">

## Main components

There is a frontend application, a backend server, a daemon service (for writing data to database) and a mysql database instance. 

## A typical user workflow

**#1.** A user uploads a CSV through web UI which makes an `POST /upload` API call.

**#2.** `POST /upload` saves uploaded file to a configured upload directory and returns HTTP 201 status code with a jobId on success.

**#3.** The file uploaded in the upload directory gets automatically picked up by a deamon service (which continuously watches the upload directory) for processing. The deamon process parses the file and writes to the mysql database. On successful file processing, the file is removed from the upload directory. However, if the error occur either on parsing or writing, the file is moved to another directory called error directory.

**#4.** Web app polls `GET /upload` with jobId to get the status of the file processing. The status could be `fail`, `success` or `in-progress`.

**#5.** `GET /upload` endpoint returns `in-progress` when file (related to jobId) is found under upload directory, `fail` when file is found under error directory or `success` when file is present neither in upload directory nor in error directory.

**#6.** Once the file processing is done successfully, the payroll report table is automatically reloaded with new data by fetching the latest contents from `GET /report`.


## Use-case breakdown

* User should be able to upload a CSV file with a specific format. Each CSV file should have a unquie report identifier and application should not allow to 


# Run & Build Instructions

### Step 0: Install npm and node

First of all, make sure you have node and npm installed on your system. It can be installed by simply running following command on Mac terminal:

```sh
brew install node
```

To check whether you have got node and npm, run following commands:

```sh
node -v
npm -v
```

Refer. https://nodejs.org/en/download/package-manager/ for node installation instructions on other OS.

### Step 1: Run frontend application

1. Go to `cd wave-payroll-frontend`.

2. Install all dependencies of frontend application first. Run `npm i`.

3. Start application `npm start`.

4. Open http://localhost:3000/ on your browser.

### Step 2: Run backend API server

1. Go to `cd wave-payroll-backend`.

2. Install dependencies by running `npm i`.

3. Update `config.json` and provide ``

4. Start server. 

Either

```sh
npm start
```
 
Or

```sh
pm2 start app.js
```

It is recommended to use pm2 to make sure our server remain alive forever. 

To install pm2, run `npm install pm2 -g`.

### Step 3: Start daemon node service for processing uploaded files

1. Go to `cd wave-payroll-backend`.

2. Start service.

Either

```sh
node ./api/lib/save_to_db_deamon.js
```

Or

```sh
pm2 start ./api/lib/save_to_db_deamon.js
```

Note: The backend and daemon service combined logs can be viewed by running following command:

```sh
pm2 logs 
```

That's it! Start playing. Go to http://localhost:3000/.


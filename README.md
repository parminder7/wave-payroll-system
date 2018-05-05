# Quick demo 

![demo-wave mov](https://user-images.githubusercontent.com/7086220/39659564-dbe7f726-4ff8-11e8-8a29-15e9b428bb46.gif)

# Design wave-payroll-system

<img width="730" alt="screen shot 2018-04-29 at 10 30 10 pm" src="https://user-images.githubusercontent.com/7086220/39658848-e0637960-4fe9-11e8-81e4-edefa9a1cc4b.png">


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

2. Install all dependencies of drontend application first. Run `npm i`.

3. Start application `npm start`.

4. Open http://localhost:3000/ on your browser.

### Step 2: Run backend API server

1. Go to `cd wave-payroll-backend`.

2. Install dependencies by running `npm i`.

3. Start server. 

Either

```sh
npm start
```
 
Or

```sh
pm2 start app.js
```

It is recommended to use pm2 to make sure our server always remain alive forever. 

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


# iSeaGrass

The [Massachusetts Division of Marine Fisheries (MA DMF)](https://www.mass.gov/orgs/division-of-marine-fisheries) and the [Massachusetts Bays National Estuary Partnership (MassBays)](https://www.mass.gov/orgs/massachusetts-bays-national-estuary-partnership) developed this web application to facilitate data collection of seagrass presence and health by citizen and professional scientists.

## About

MA DMF and MassBays collect data on the seagrass health in the coast around Massachusetts. This data gathering is done by the scientists themselves as well as citizen scientists, people who offer to help but might not have a formal science background.

In gathering the data it can be unclear what the protocol is, the data needed, and the expected value. The data collected from these trips can vary in accuracy, sometimes being so inaccurate it cannot be used.

To help make data collection faster, easier, and simpler, an app was proposed that would help all the users gather data. The app should be powerful enough to make the scientist's life easier when gathering data as well as helpful enough for the citizen scientists.

## Design

The app is written in [React] using [Next.js] with offline mode enabled with Google's [Workbox]. The contents of the project are almost entirely React components.

### Web App

The project was originally and designed and prototyped by students who decided that a web app would be the best approach toward solving the data collection problem. Other solutions were considered but ultimately a web app was decided on. A web app can be quickly prototyped and iterated over and deployed for quick feedback. It has no third party review cycle and can be hosted almost anywhere. It can utilize the web technologies to get the user's location, save data offline, and live on the home screen like a native app.

There are some downsides to using a web app. Even with offline mode enabled the user still needs to load the app before getting out of internet range. Browser restrictions and limitations stop the app from working as nicely as a native app. The look and feel of the web app is still very "webby", and does not feel like a native app.

Still, these limitations were discussed and tested and ultimately did not impede the app's functionality. A testament to how far web technologies have come.

### Mobile First

The app was designed to be used on a phone and tablet at sea on a boat. Care was taken to ensure that use case, above all others, worked well. The app was tested on many trips and usability was a high concern. Not only easy usage of navigation and button size, but also clarity of screens and being able to guide the user through the process. Citizen scientists might not have as much experience with the data collection protocol and being able to easily fill out the data as easily as possible was also very important.

To that end, the app leverages some brains as often as it can to make the user's life easier. Stations will autofill as much data from a previous station as makes sense, often allowing the user to skip entire sections to fill out (things like weather just don't change that often). The app uses HTML `input` attributes to only allow expected data to be entered. The app highlights missing data, but always allows the user to upload the trip - the data collection is the most important aspect.

### Offline Mode

The user is often outside of internet range so offline mode was a must. Once loaded, the entire app has to completely work with no internet access (with the exception of uploading the data). This is accomplished using Workbox. During build time a cache of all pages and assets is built and placed into a cache that is served by a Service Worker. The user only needs to load web page once for the service worker to register and enable the cache, allowing the user to launch the app without internet access from that point forward.

It is important to note that while the app can function without internet, other parts of the app during data collection try to use GPS, which often requires some connection. In practice, this means the phone is not placed in airplane mode, but won't have cell service. This tends to have negative implications on the battery life during data collection.

### iOS Gotchas

Taken from [this page](https://love2dev.com/pwa/ios/).

> Another quirk PWAs have on iOS is being purged. This can be very
> problematic.
>
> Because Apple assumes space on its devices is cramped, they aggressively
> throw unused items overboard to free up disk space.
>
> If your PWA or any website for that matter, goes unused for a few days (we
> think it is roughly 14 days, it is not documented) the device will remove
> all cached assets associated with the origin. This includes IndexedDB,
> service worker cache, localStorage, etc.
>
> This has made relying on cached assets a bit of an issue. The real problem
> lies when a user might try to load your PWA while they are offline for the
> first time in a month. The PWA won’t work, even if your service worker
> pre-caches all the required files for offline functionality. This means you
> should also build in a check for purged cached assets in your service
> worker. I think just important is you should also include some sort of
> notice for your users if they expect the application to function offline.
>
> Let them know the content they are caching now may not be available if
> unused for a long period of time. If they anticipate needing your app for
> offline usage try to plan ahead.
>
> In theory your cached content could be purge by other browsers too, but
> they are not as aggressive. Providing a message to set user expectations
> can go a long way to curb potential issues down the road.

### Cloud Data Storage

Collecting data on the phone is only useful if it can be analyzed by other people. Once a trip has been taken the user will upload the data from their device to the cloud, where it can later be pulled down by a scientists who will analyze it.

The exact mechanism for saving this data is ambiguous because:

1. The data is not complex and therefore can be saved in many ways
2. The final hosting environment is unknown

During development, care was taken to make uploading (and therefore, downloading) the data as simple as possible while being a robust solution. [Firebase] was chosen for the final database because it is:

1. A simple cloud database that can store JSOn well
2. Managed by Google, providing a high level of confidence in the data storage
3. Hosted, so this web app does not need to make any assumptions on it's hosting environment
4. Free.

Other data storage could be used as well. Any database can be used to store this information, SQL or NoSQL. Postgres is a good option for SQL databases, or MongoDB for NoSQL database.

## Development

### Getting Started

```bash
yarn install
yarn dev
```

This will start the local development server on port 3000, you can go to http://localhost:3000 to see the app. It has a built in live refresh so just start making changes to the code and the page will automatically update.

### Testing

```bash
yarn lint
```

Unit tests are not present although the app was thoroughly tested in the field.

### Firebase

The app stores its data in Firebase but because we are allowing any user to use the app and any users to download the data no user authentication is needed for Firebase. The actual connection is managed via an API call on the Next.js server side which handles the Firebase authentication.

If you want to enable the upload/download API you will need credentials to Firebase. If you want to use the production database you will need to contact the owner of the app for those credentials. If you just want to use your own, you will need:

1. Create a Firebase project
2. Follow the instructions [here](https://firebase.google.com/docs/admin/setup) to "generate a private key file for your service account".
3. Once you have the downloaded JSON file, since this is not hosted on Google, it will need to be set as an environment variable:

```bash
export FIREBASE_CONFIG=$(cat name-of-downloaded-json-secret-key.json | jq -c .)
```

Set that in the same shell as your server (development or production) and restart it and you will have Firebase working.

### Technologies

- [Yarn] for package management.
- [TypeScript].
- [Next.js] as a React+ framework. Next.js provides a fantastic router, server side rendering of pages, powerful plugins, and great development support.
- [React] UI Framework.
- [Boostrap] for the UI library and [Reactstrap] for the React implementation of it.
- [idb] for a nicer interface on top of IndexDB for an offline database.

### App Structure

- `components` hold React components that are used across multiple pages. Some sub folders hold common components for certain pages. Some components are only used in one location but were broken out to make file size more manageable.
- `contexts` hold React contexts. DatabaseContext allows subviews to access the database.
- `db` holds the definition of our IndexDB database. Changing almost anything in this file will require a new version of the database, so be careful!
- `hooks` hold React hooks, useful for all sorts of dynamic data.
- `models` hold the model definitions used across the app.
- `pages` hold the Next.js pages used for routing. These are server-side rendered in production but always load data from the local database. [Read about Next.js routing](https://nextjs.org/docs/routing/introduction).
- `public` static assets.
- `styles` hold global css styles. Most of the time these are not used, instead opting for [inline jsx](https://nextjs.org/docs/basic-features/built-in-css-support#css-in-js), but a couple of exceptions were made.
- `utils` hold miscellaneous commonly used code on both the client and server. These are not React components, just normal code.

### Data Structure

The app collects 4 connected pieces of data.

- _Trip_, which a group of scientists take. Usually one trip will be collected for an entire day out on the water. A trip has many stations.
- _Station_, which is one station visited. Each station has an ID, lives in a harbor, and other measurements are taken at each station, including the location, weather, and a secchi drop. A station has four drop frames and 0-4 indicator samples.
- _Drop Frame_, four drop frames are measured, one at each corner of the boat. These will observe how much sea grass is present.
- _Indicator Sample_, if the station is an indicator station, than samples of the sea grass are taken.

The app guides the user through a hierarchy of screens to collect this information.

Home -> Trips -> Trip -> Stations -> Drop Frame/Samples. This functions similar to native apps where the user "drills down" to the more detailed screen and then can go back to the higher levels.

## Deployment

The web app can be deployed anywhere, although there are a few considerations to make.

The app is, first and foremost, a static website. The Next.js framework is the default process used to run the website. When run in this way, it also handles serving the API routes via its backend ([Next.js deployment]). When run in this way the app expects a Node.js runtime.

In any Node.js runtime, the basic commands to run a production build are `yarn build && yarn start`.

#### Environment Variables

```bash
FIREBASE_CONFIG={...entire json blob...}
```

The only backend environment variable needed is the Firebase credentials. This will be a JSON object with the credentials embedded. See the [Firebase](#firebase) section above for how to get them.

### Vercel

[Vercel] was used as the development environment. It's built by the same team which builds Next.js and they work great together. Connect the git repo to the Vercel service and it deploys instantly. [Instructions](https://nextjs.org/docs/deployment).

### Heroku

Heroku has great support for Node.js applications. To deploy on Heroku update the `package.json` `start` script to say:

```
next start -p $PORT"
```

Heroku starts processes on non standard ports so this will enable the app to listen on the port Heroku requests.

```
heroku create iSeaGrass
git push heroku master
```

Heroku will build and deploy the app.

### Static Website

When deployed as a static website the API routes will _not work_. However, the web app to gather data can be hosted anywhere and the API functions can be separated out to another place, like AWS Lambda.

```bash
yarn export
```

This will create an `out` directory that contains the files to be hosted on a server.

[react]: https://reactjs.org/
[next.js]: https://nextjs.org/
[next.js deployment]: https://nextjs.org/docs/deployment
[yarn]: https://yarnpkg.com/
[typescript]: https://www.typescriptlang.org/
[bootstrap]: https://getbootstrap.com/
[reactstrap]: https://reactstrap.github.io/
[idb]: https://github.com/jakearchibald/idb
[vercel]: https://vercel.com/

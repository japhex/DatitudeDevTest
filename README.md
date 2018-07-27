# Datitude Dev Test #

Hey! This is the current developer test for Datitude. Please take as long as you need, and try to complete everything. If there is something you cannot complete or are unsure of, please provide feedback on this when you send the test back completed.

/======================================================================/

### Architecture & Setup ###

The test is a very small, very simple Node application. Firstly to get it to run you will need to install the dependencies. Please run the following in both the 'app' and 'front-end' folders:

```
npm install

```

Great! You will need to run the node application and also the frontend. Next in the 'front-end' directory, simply run the following to have a live watching/compiling webpack server:

```
webpack

```

And secondly, inside the 'app' folder, run the following to start the application on port 3000:

```
npm start

```

Now if you navigate to 'localhost:3000' you should see the app!

**Requirements**

This is the basis of a new site for a small business, and as such there are a few areas that need some work. Please try to fix the following issues:

- There is a rogue character appearing on the page before the title, please find and remove this.
- The navigation is being loaded from the API, but its not being rendered to the page, please format this into a proper navigation menu using the data supplied.
- There is currently a route for the homepage and for the navigation, however there is no route to load the homepage content, please create this and make sure it responds with the content as a JSON object.
- There is no route for the About Us page, please create this and use the same data flow as for the homepage.
- There is no design for this site or its pages, this is up to you. Do not feel pressured to deliver an eye wateringly stunning design, that is not the point. The point is adding some meaningful markup and CSS and remembering that there are elements that may be repeated. We want to see that you can interperet requirements in a clean, DRY (Don't repeat yourself) fashion.

**Bonus**

This bonus section is absolutely not mandatory, it is here to be thought about by you, the candidate. If you're particularly enjoying the app you've just worked hard on finishing for this small business and want to add some extra flair, API's or pages, why not do just that? Doesn't every business need a Contact Us page with a form? Its your responsibility as a developer to use your experience to help the client form a decent view of what their website/application should be, also.
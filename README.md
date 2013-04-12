confused
========

App that lets people say where they're confused or not.

getting started
---------------

Make sure you have meteor installed
```sh
curl https://install.meteor.com | /bin/sh
```

Clone this repo
```sh
git clone https://github.com/jdubie/confused
cd confused
```

Run server locally
```sh
make run
```

Push to production
```sh
make deploy
```

Files
- `app.js` all application logic
- `index.html` all templates
- `boostrap-main.css` styling (hacky: filename must be alphabetically before `boostrap-responsive.css`)
- `boostrap-responsive.css` styling for mobile

Implementation
--------------
Upon application `startup` the app sets a client generated random id in the
browser localStorage. This uniquely identify this device (approximating a
student) across page refreshes. The app then binds for click events on "I'm
confused" button. Each click toggles the application state (confused to not
confused and visa versa). This state is saved to database. In `Template.peers`
in `app.js` the app displays the total number of people who are in each state.
After a class is over or if someone closes the app they'll be removed
(assumption: probably not confused if they close app).  Number of "live"
students is approximated by having "live" students update a `lastActivity`
every 2.5 seconds.

TODO
----
- Add a field to `Students` collection to specify which class they are in
- Better solution than client hearting `lastActivity`
- Location based class inference
- BUG: number of active connection does not decrementing when students timeout

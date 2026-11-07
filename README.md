# This is a tool used for Data Completion on Open Food Facts.
* Please use it with care, and join the internal Slack channel before using it, as it can create non-quality quickly.

* We have created a Chrome extension to allow bulk modifications to Open Food Facts
* Very concretely, you can install it, go to a page of similar products obtained from the advanced search
* eg. products containing the term "lobster rillettes" that are not categorized
* You click on select all, uncheck any intruder products, and you can add the category Lobster Rillettes (or de: ) to all these checked products
* the installation requires some manipulation for the moment, but it's worth it
* It works well in coordination with the [Power User Script](https://github.com/openfoodfacts/power-user-script)
* It does not currently work with Open Food Facts explorer

# Screenshot
<img width="1020" height="1088" alt="image" src="https://github.com/user-attachments/assets/d6796084-c5b2-4d91-90e6-98cebfea78c7" />


# Installation on Chrome
* Fork the repo
* Start Chrome
* In the URL bar type chrome://extensions
* Enable developer mode (it's a button)
* Click on "Load unpackaged extension"
* Navigate to your local repo

The extension is now installed, and will appear at the top right, if you are logged into your account, in the form of a red button with a white pencil

# Installation on Firefox (build from latest source)

* Fork the repo
* Install web-ext: `npm install --global web-ext`
* Either:
  * run it threw the extension directory thanks to web-ext: `web-ext run`
  * build an extension and install it
    * into the extension directory: `web-ext build`
    * into Firefox enter `about:debugging#/runtime/this-firefox` as the URL
    * Menu "load a temporary module" > pick the file generated from the `web-ext build` command
    * redo this operation each time you want to use it

* Note: if you want to do the "build" method above without installing npm, you might use docker:
  * go to the project directory
  * launch `docker run --rm -ti -v $(pwd):/home/node node:lts-slim bash`
  * within the container run the following:
    ```bash
    cd /home/node
    npm install --global web-ext
    web-ext build
    exit
    ```
  * the extension will be inside the `web-ext-artifacts` folder

The extension is now installed, and will appear at the top right, if you are logged into your account, in the form of a red button with a white pencil

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
    * into Firefox enter `about:addons` as the uRL
    * Menu "install a module from a file" > pick the file generated from the `web-ext build` command

The extension is now installed, and will appear at the top right, if you are logged into your account, in the form of a red button with a white pencil

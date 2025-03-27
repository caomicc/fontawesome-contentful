This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

## How to use

Execute create-contentful-app with npm, npx or yarn to bootstrap the example:

```bash
# npx
npx create-contentful-app --typescript

# npm
npm init contentful-app -- --typescript

# Yarn
yarn create contentful-app --typescript
```

## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### `npm run upload`

Uploads the build folder to contentful and creates a bundle that is automatically activated.
The command guides you through the deployment process and asks for all required arguments.
Read [here](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/#deploy-with-contentful) for more information about the deployment process.

#### `npm run upload-ci`

Similar to `npm run upload` it will upload your app to contentful and activate it. The only difference is  
that with this command all required arguments are read from the environment variables, for example when you add
the upload command to your CI pipeline.

For this command to work, the following environment variables must be set:

- `CONTENTFUL_ORG_ID` - The ID of your organization
- `CONTENTFUL_APP_DEF_ID` - The ID of the app to which to add the bundle
- `CONTENTFUL_ACCESS_TOKEN` - A personal [access token](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/personal-access-tokens)

## Libraries to use

To make your app look and feel like Contentful use the following libraries:

- [Forma 36](https://f36.contentful.com/) – Contentful's design system
- [Contentful Field Editors](https://www.contentful.com/developers/docs/extensibility/field-editors/) – Contentful's field editor React components

## Using the `contentful-management` SDK

In the default create contentful app output, a contentful management client is
passed into each location. This can be used to interact with Contentful's
management API. For example

```js
// Use the client
cma.locale.getMany({}).then((locales) => console.log(locales));
```

Visit the [`contentful-management` documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/#using-the-contentful-management-library)
to find out more.

## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

# Font Awesome Icon Picker for Contentful

A Contentful app that allows users to easily search and select Font Awesome icons. This app provides a user-friendly interface for adding Font Awesome icons to your content model fields.

## Features

- Search through Font Awesome icons by name, value, or search terms
- Filter icons by style (solid, regular, light, thin, duotone, brands)
- Preview icons before selection
- Configurable search behavior and appearance
- Fully customizable through the app configuration screen

## Prerequisites

- A Contentful account
- Font Awesome Pro license (for access to all icon styles)
- Node.js (version 14 or higher)
- npm or yarn

## Installation

1. Clone this repository:
   ```bash
   git clone [your-repository-url]
   cd fontawesome-contentful
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Font Awesome:
   - Place your Font Awesome Pro token in your environment:
     ```bash
     export FONTAWESOME_NPM_AUTH_TOKEN=your-token-here
     ```
   - Or create a `.npmrc` file in the project root:
     ```
     @fortawesome:registry=https://npm.fontawesome.com/
     //npm.fontawesome.com/:_authToken=your-token-here
     ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Contentful Setup

1. Go to your Contentful space
2. Navigate to Settings > Apps
3. Click "Add app" > "Create app"
4. Enter the app details:
   - App name: "Font Awesome Icon Picker"
   - App URL: Your app's URL (during development, this will be localhost:3000)
   - Locations: 
     - Entry field
     - App configuration screen

5. Install the app in your space
6. Add a new field to your content type:
   - Field type: JSON object
   - Name: "Icon"
   - App: Select "Font Awesome Icon Picker"

## Configuration Options

The app can be configured through the configuration screen with the following options:

### Icon Styles
- Enable/disable specific icon styles:
  - Solid
  - Regular
  - Light
  - Thin
  - Duotone
  - Brands

### Search Settings
- Maximum suggestions to show (default: 5)
- Minimum characters to trigger search (default: 2)
- Search in:
  - Icon terms
  - Icon names
  - Icon values

### Appearance
- Icon size (in pixels)
- Search placeholder text
- Icon preview background color
- Icon preview border color

## Usage

1. Open an entry with the Font Awesome Icon Picker field
2. Click in the field to open the icon picker
3. Search for icons using the search input
4. Click an icon to select it
5. The selected icon will be displayed in the field with its preview

## Development

### Available Scripts

- `npm start` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run test` - Runs the test suite
- `npm run upload` - Uploads the app to Contentful
- `npm run upload-ci` - Uploads the app in CI environment

### Environment Variables

Required for deployment:
- `CONTENTFUL_ORG_ID` - Your Contentful organization ID
- `CONTENTFUL_APP_DEF_ID` - The app definition ID
- `CONTENTFUL_ACCESS_TOKEN` - Your Contentful access token

Required for Font Awesome:
- `FONTAWESOME_NPM_AUTH_TOKEN` - Your Font Awesome Pro token

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any problems or have questions, please:
1. Check the [issues page](your-repo-issues-url)
2. Create a new issue if your problem isn't already listed
3. Contact Contentful support for platform-specific questions

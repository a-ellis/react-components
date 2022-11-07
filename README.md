# React Components

A simple React component library written in TypeScript.

# Requirements

This project requires the following to run:

- [Node.js](https://nodejs.org/) version `^16.16.0`
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

# Getting Started

## Running the Project

This project uses [Storybook](https://storybook.js.org/) to serve a local app for previewing the component available in this library. To get started:

**Install dependencies**

```bash
npm install
```

**Start the App**

```bash
npm start
```

Once started, the Storybook application will be available at http://localhost:4400/. Opening this URL in a browser should load the `Primary` story under `Slider`.

The `Slider` component has a handful of stories detailing different usages of the component, including:

- Primary - displays the `Slider` with all of its explicitly defined props.
- Default Value - example initializing an uncontrolled `Slider` with a `defaultValue`.
- Keyboard Navigation - sets focus to the `Slider` and demonstrates how the arrow keys can be used to change the value.
- In HTML Form - renders a `Slider` within a `<form>` element, showing how it acts as a form control.

## Building the Library

To build a distributable version of the component library in this project:

**Build Library package**

```bash
npm run build
```

This will generate a bundled version of the component library from the `libs/components` directory in `/dist/libs/components`. These output files can either be used directly, or:

**Pack Library Package**

```bash
npm run pack:lib
```

This will use `npm pack` to create a local [tarball](<https://en.wikipedia.org/wiki/Tar_(computing)>) file of the component library, with a name in the form of `aellis-react-components-X.X.X.tgz`.

This `.tgz` can be installed directly in another project via npm, with a path to the file. E.g.

```bash
# With aellis-react-components-0.0.1.tgz copied to ~/Downloads
~/Documents/my-project> npm install ~/Downloads/aellis-react-components-0.0.1.tgz
```

After that, the `Slider` component can be imported into the existing project from `@aellis/react-components`, e.g.:

```typescript
import { Slider } from '@aellis/react-components';
```

# Notes

This project was scaffolded using [Nx](https://nx.dev/getting-started/intro) from the team at [nx.dev](https://nx.dev/).

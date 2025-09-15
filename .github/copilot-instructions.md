# OFFMassUpdate Browser Extension

OFFMassUpdate is a browser extension for Chrome and Firefox that enables mass updating of Open Food Facts product information. The extension injects UI elements into Open Food Facts website pages to allow bulk editing of product metadata like packaging, brands, categories, and other fields.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the information provided here.**

## Working Effectively

### Bootstrap and Build the Repository
- Install Node.js if not available: The repository requires Node.js for the web-ext tool
- Install web-ext globally: `npm install --global web-ext` -- takes ~25 seconds, NEVER CANCEL
- Build the extension: `web-ext build` -- takes ~0.4 seconds
- Lint the extension: `web-ext lint` -- takes ~1.8 seconds

### Alternative: Docker Build (if npm install fails due to firewall limitations)
Use this approach when npm install fails in restricted environments:
```bash
docker run --rm -ti -v $(pwd):/home/node node:lts-slim bash -c "cd /home/node && npm install --global web-ext && web-ext build"
```
This command takes ~50-60 seconds total (Docker pull + npm install + build). NEVER CANCEL. Set timeout to 120+ seconds.

### Development and Testing
- **CANNOT** run the extension interactively in this environment as `web-ext run` requires a GUI browser
- Test extension syntax and structure: `web-ext lint`
- Build for distribution: `web-ext build --overwrite-dest`
- The built extension will be in `web-ext-artifacts/off_mass_updater-1.0.0.zip`

## Validation

### Pre-Commit Validation
- **ALWAYS** run `web-ext lint` before making changes - ensures extension structure is valid
- **ALWAYS** run `web-ext build` after changes to ensure no build errors
- **NEVER CANCEL** build commands - they complete quickly (under 2 seconds each)

### Extension Structure Validation
- Verify manifest.json validity by checking `web-ext lint` output
- Expected lint warnings: 3 warnings in js/external/jquery.js related to innerHTML (these are in external library and acceptable)
- Zero errors and zero notices should be the target - any new errors indicate problems

### Manual Testing Scenarios (when browser is available)
Since this extension modifies Open Food Facts web pages, manual testing requires:
1. Load extension in Chrome or Firefox development mode
2. Navigate to any Open Food Facts product search page (e.g., https://world.openfoodfacts.org/cgi/search.pl)
3. Verify the red pencil button appears in top-right corner
4. Test checkbox appearance on product listings
5. Test mass update form functionality

## Repository Structure

### Key Files and Directories
```
/
├── manifest.json           # Extension manifest (permissions, content scripts)
├── js/
│   ├── content_script.js   # Main extension logic (356 lines)
│   └── external/           # Third-party libraries
│       ├── jquery.js       # jQuery library (86KB)
│       ├── jquery-ui.min.js # jQuery UI (32KB)  
│       └── jquery.tagsinput.js # Tags input plugin (16KB)
├── css/
│   ├── myStyle.css         # Extension-specific styles
│   └── external/           # External CSS libraries
├── _locales/               # Internationalization
│   ├── en/messages.json    # English translations
│   └── fr/messages.json    # French translations (default)
├── img/                    # Extension icons and images
└── web-ext-artifacts/      # Build output directory
```

### Core Functionality Areas
- **Content Script Injection**: Adds checkboxes and mass edit UI to OFF product pages
- **Mass Update Form**: Dropdown selection for field types (packaging, brands, categories, etc.)
- **API Integration**: Calls OFF API endpoints for bulk product updates
- **Tag Input System**: Uses jQuery plugin for autocomplete tag input
- **Progress Tracking**: Shows success/failure counts during bulk operations

### Common Build Issues
- **Permissions Error**: If build fails with permissions error on web-ext-artifacts/, run `rm -rf web-ext-artifacts/` first
- **Global npm Install**: web-ext must be installed globally to work properly
- **Docker Alternative**: Use Docker approach if npm install fails due to network restrictions

### Dependencies
- **No package.json**: This project doesn't use npm for dependencies - libraries are included directly
- **jQuery Dependencies**: Uses jQuery, jQuery UI, and jQuery TagsInput plugin (all included in js/external/)
- **web-ext Tool**: Required for building and linting - install globally with npm

### Expected Timings (set timeouts accordingly)
- `npm install --global web-ext`: ~25 seconds (set timeout: 60+ seconds)
- `web-ext build`: ~0.4 seconds (set timeout: 30 seconds)
- `web-ext lint`: ~1.8 seconds (set timeout: 30 seconds)
- Docker build approach: ~50-60 seconds (set timeout: 120+ seconds)

### Extension Testing Requirements
- Extension functionality requires Open Food Facts website interaction
- Cannot be fully tested in headless environments
- Use `web-ext lint` for structural validation
- Use `web-ext build` to ensure no packaging errors

## Development Workflows

### Making Code Changes
1. Edit JavaScript files in js/ directory (mainly content_script.js)
2. Edit CSS in css/myStyle.css for styling changes
3. Update manifest.json for permission or structure changes
4. Update _locales/ files for internationalization changes
5. **ALWAYS** run `web-ext lint` after changes
6. **ALWAYS** run `web-ext build` to verify packaging works

### Adding New Features
- Modify js/content_script.js for new functionality
- Add new UI elements to form_template variable if needed
- Update CSS in css/myStyle.css for new styling
- Add translations to both _locales/en/ and _locales/fr/ directories
- Test with `web-ext lint` and `web-ext build`

### Debugging
- Use `web-ext lint --verbose` for detailed validation output
- Check browser developer console when testing in actual browser
- Extension console.log statements will appear in browser dev tools
- Syntax errors will show up in `web-ext lint` output

## Working with External Libraries
- jQuery libraries are in js/external/ - **DO NOT MODIFY** these files
- Expected lint warnings from jQuery are normal (3 innerHTML warnings)
- To update jQuery, replace files in js/external/ and update manifest.json references
- Test all changes with `web-ext lint` after library updates

## CI/CD Integration
- Repository uses GitHub Actions for CodeQL security scanning
- No automated build/test pipeline - validation is manual via web-ext
- Extension must be manually tested in browsers
- Use `web-ext lint` as the primary automated validation step

## Common Commands Reference

```bash
# Install dependencies
npm install --global web-ext

# Build extension  
web-ext build

# Build with overwrite
web-ext build --overwrite-dest

# Lint extension
web-ext lint

# Verbose lint output
web-ext lint --verbose

# Docker build (if npm fails)
docker run --rm -ti -v $(pwd):/home/node node:lts-slim bash -c "cd /home/node && npm install --global web-ext && web-ext build"

# Clean build artifacts
rm -rf web-ext-artifacts/
```

**CRITICAL TIMEOUT VALUES:**
- npm install commands: minimum 60 seconds
- Docker commands: minimum 120 seconds  
- Build commands: minimum 30 seconds
- **NEVER CANCEL** any build operation - they complete quickly
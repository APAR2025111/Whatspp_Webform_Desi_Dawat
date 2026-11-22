# Desi Dawat customer order form

This is a separate static app for customers. It contains only the products shown on the supplied menu pages and sends a completed cart to Desi Dawat on WhatsApp. It does not need the main website or its API.

## Build

Run `npm install` and `npm run build` from this folder. Upload the generated `dist` folder to a static web host to create its own public URL.

The order form is ready to publish. Generate the customer QR code after the host assigns the permanent public URL so it points to the right page.

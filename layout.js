module.exports = ({ body }) => `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link href="/static/styles.css" rel="stylesheet" />
  </head>
  <body>
    ${body}
    <script src="/static/main.js"></script>
  </body>
</html>
`

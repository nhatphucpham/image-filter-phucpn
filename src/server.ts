import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.

  /**
   * @param image_url String
   * @returns filw with filePath
   */
  app.get("/filteredimage", async (req, res) => {
    // 1. validate the image_url query
    const { query: { image_url: imageURL } } = req;
    if (!imageURL && typeof imageURL != 'string') {
      res.status(400).send("image_url is required!")
    }

    // 2. call filterImageFromURL(image_url) to filter the image
    let filteredImageURL: string = null;
    try {
      if(typeof imageURL === 'string') {
        filteredImageURL = await filterImageFromURL(imageURL);
      }
      // 3. send the resulting file in the response
      res.status(200).sendFile(filteredImageURL, (err) => {
        // 4. deletes any files on the server on finish of the response
        if (!filteredImageURL) {
          res.status(404).send("Image not found");
        }
        if (!err) {
          deleteLocalFiles([filteredImageURL])
        }
      })
    } catch (error: any) {
      // 1. validate the image_url query
      res.status(422).send(`Image cannot filter<br/>${error.stack}`);
    }
  });
  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
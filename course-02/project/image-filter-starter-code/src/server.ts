import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

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
app.get('/filteredimage/',async ( req: Request, res: Response) => {

  try {
    let { image_url } :{image_url:string} = req.query;

    if ( !image_url ) {
      return res.status(400)
                .send(`image URL is required`);
    }
    const filteredImage:string = await filterImageFromURL(image_url)
    
    return res.status(200)
              .sendFile(filteredImage, async()=>{
                await deleteLocalFiles([filteredImage])
              });
    
  } 
  catch (error) {
    return res.status(422).send('image process error')
  }
  
})
  
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const router = express.Router();
const survtech = require("../services/survtech");
var path = require('path');
const videoFolderPath = 'C:\\Users\\KIIT\\Desktop\\survtech\\VideoTest';
/* GET evCharge. */
router.get('/device_info', async function(req, res, next) {
  try {
    res.json(await survtech.DeviceInf());
  } catch (err) {
    console.error(`Error while getting Devices `, err.message);
    next(err);
  }
});
router.get('/recordings', async function(req, res, next) {
  fs.readdir(videoFolderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    // Filter out non-video files (modify as needed)
    const videoFiles = files.filter(file => /\.(mp4|webm|mkv)$/i.test(file));

    res.json(videoFiles);
  });
});
router.post('/panic', (req, res) => {
  const mp3FilePath = path.join('../', 'audio', 'panic.mp3');
  // Use the play command to play the audio file
  const command = `play "${mp3FilePath}"`;

  // Execute the command as a child process
  const playProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error(`Error: ${error.message}`);
          res.status(500).send('Error playing audio on the server');
          return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
  });

  playProcess.on('exit', (code) => {
      console.log(`play process exited with code ${code}`);
  });

  // Send a response to the client
  res.status(200).send('Playing audio on the server');
});
// /* POST evCharge */
// router.post('/add_car', async function(req, res, next) {
//     try {
//       res.json(await evCharge.create_car(req.body));
//     } catch (err) {
//       console.error(`Error while creating evCharge`, err.message);
//       next(err);
//     }
//   });
  router.post('/run-script', (req, res) => {
    // Execute the Python script
    exec(`python "C:\\Users\\KIIT\\Desktop\\EVCharge\\restcheck\\graph.py"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(error.message);
        }
        fs.access('C:\\Users\\KIIT\\Desktop\\EVCharge\\restcheck\\ev.html', fs.constants.F_OK, (err) => {
          if (err) {
              return res.status(500).send('Error generating the "ev.html" file');
          }
          res.sendFile(`${path.join(__dirname, '..', 'ev.html')}`, (err) => {
            if (err) {
                return res.status(500).send(err.message);
            }
        });
      });
  });
});
// /* PUT evCharge */
// router.put('/update_car/:id', async function(req, res, next) {
//     try {
//       res.json(await evCharge.update_car(req.params.id, req.body));
//     } catch (err) {
//       console.error(`Error while updating evCharge`, err.message);
//       next(err);
//     }
//   });
//   router.put('/update_charger/:id', async function(req, res, next) {
//     try {
//       res.json(await evCharge.update_charger(req.params.id, req.body));
//     } catch (err) {
//       console.error(`Error while updating evCharge`, err.message);
//       next(err);
//     }
//   });
  
//   /* DELETE evCharge */
// router.delete('/del_car/:id', async function(req, res, next) {
//     try {
//       res.json(await evCharge.remove_car(req.params.id));
//     } catch (err) {
//       console.error(`Error while deleting evCharge`, err.message);
//       next(err);
//     }
//   });
  
module.exports = router;
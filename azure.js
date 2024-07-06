
var account = "sjoeasdibst15";
var fileShare = "images";
var sas =
  "?sv=2022-11-02&ss=f&srt=co&sp=rwdlc&se=2024-05-26T03:31:13Z&st=2023-05-25T19:31:13Z&spr=https&sig=MGlNapyDF6j8iY2taW74ds5pwkAohNWHd1Jgl54aRTM%3D";

var currentPath = "";
var fileUri = "";
var currentPath = [];

function checkParameters() {
  if (account == null || account.length < 1) {
    alert("Please enter a valid storage account name!");
    return false;
  }
  if (sas == null || sas.length < 1) {
    alert("Please enter a valid SAS Token!");
    return false;
  }

  return true;
}

function getFileService() {
  if (!checkParameters()) return null;

  fileUri = "https://" + account + ".file.core.windows.net";
  var fileService = AzureStorage.File.createFileServiceWithSas(
    fileUri,
    sas
  ).withFilter(new AzureStorage.File.ExponentialRetryPolicyFilter());
  return fileService;
}

function viewFileShare(selectedFileShare) {
  fileShare = selectedFileShare;
  alert("Selected " + fileShare + " !");
  currentPath = [];
  refreshDirectoryFileList();
}

function refreshDirectoryFileList(directory) {
  var fileService = getFileService();
  if (!fileService) return;

  if (fileShare.length < 1) {
    alert("Please select one file share!");
    return;
  }

  if (typeof directory === "undefined") var directory = "";
  if (directory.length > 0) currentPath.push(directory);
  directory = currentPath.join("\\\\");

  document.getElementById("directoryFiles").innerHTML = "Loading...";
}

function displayProcess(process) {
  document.getElementById("progress").style.width = process + "%";
  document.getElementById("progress").innerHTML = process + "%";
}

function createFileFromStream(checkMD5) {
  var files = document.getElementById("files").files;
  if (!files.length) {
    alert("Please select a file!");
    return;
  }
  var success = 0;

  for (j = 0; j < files.length; j++) {
    var file = files[j];

    var fileService = getFileService();
    if (!fileService) return;

    var btn = document.getElementById("upload-button");
    btn.disabled = true;
    btn.innerHTML = "Uploading";
    var finishedOrError = false;
    var options = {
      contentSettings: {
        contentType: file.type,
      },
      storeFileContentMD5: checkMD5,
    };

    var speedSummary = fileService.createFileFromBrowserFile(
      fileShare,
      currentPath.join("\\\\"),
      file.name,
      file,
      options,
      function (error, result, response) {
        finishedOrError = true;
        btn.disabled = false;
        btn.innerHTML = "Upload";
        if (error) {
          alert("Upload failed, open browser console for more detailed info.");
          console.log(error);
          displayProcess(0);
        } else {
          // Upload Success !!
          displayProcess(100);
          setTimeout(function () {
            // Prevent alert from stopping UI progress update
            alert("Upload successfully!");
          }, 1000);
          success++;
          if (success == files.length) {
            // Insert document in a collection of MongoDB data base
            insertAlbum(
              document.getElementById("nombre").value,
              document.getElementById("ubicacion").value,
              document.getElementById("categoria").value,
              document.getElementById("descripcion").value,
              // document.getElementById('style').value,
              document.getElementById("files").files,
              destacados
            );
          }
          // Refresh directory file list
          refreshDirectoryFileList();
        }
      }
    );
  }

  speedSummary.on("progress", function () {
    var process = speedSummary.getCompletePercent();
    displayProcess(process);
  });
}
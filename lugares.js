// Songs array
const destacados = [];
// Function add song to songs array
function addSongToArray(parName, parDescription) {
  const destacado = {
    code: new stitch.BSON.ObjectId(),
    Nombre: parName,
    Descripcion: parDescription,
  };
  destacados.push(destacado);
  refreshSongs();
}
// Function refresh songs
function refreshSongs() {
  document.getElementById("songs").value = "";
  var finalResult = "";
  for (j = 0; j < destacados.length; j++) {
    var result =
      "<h1>" +
      destacados[j].Nombre +
      "</h1> <p> " +
      destacados[j].Descripcion +
      "</p>";
    finalResult = finalResult + result;
  }
  document.getElementById("songs").innerHTML = finalResult;
  document.getElementById("nomDes").value = "";
  document.getElementById("descDes").value = "";
}

// Function refresh songs
function refreshAlbums() {
  document.getElementById("ubicacion").value = "";
  document.getElementById("categoria").value = "";
  document.getElementById("descripcion").value = "";
  document.getElementById("nombre").value = "";
  document.getElementById("nomDes").value = "";
  document.getElementById("descDes").value = "";
}
// Initialize the App Client
const client = stitch.Stitch.initializeDefaultAppClient("sample_turismo-eanpv");
// Get a MongoDB Service Client
const mongodb = client.getServiceClient(
  stitch.RemoteMongoClient.factory,
  "mongodb-atlas"
);
// Get a reference to the music database
const db = mongodb.db("sample_sjo_turismo");
// Function display albums
function displayalbums() {
  db.collection("turismo")
    .find()
    .toArray()
    .then((docs) => {
      var html = "";
      for (j = 0; j < docs.length; j++) {
        var result = `<div><h1>${docs[j].nombre} - ${docs[j].ubicacion} - ${docs[j].categoria} - <a href= "https://sjoturismo.azurewebsites.net/b2-turismo.html?id=${docs[j]._id}"> Ver Lugar </a> - <a href='#' onclick='deleteAlbum("${docs[j]._id}");'>Delete album</a></h1></div>`;
        // var result = `<div><h1>${docs[j].nombre} - ${docs[j].ubicacion} - ${doc  s[j].categoria} - <a href= "http://127.0.0.1:5500/b2-turismo.html?id=${docs[j]._id}"> Ver Lugar</a> - <a href='#' onclick='deleteAlbum("${docs[j]._id}");'>Delete album</a></h1></div>`;
        for (i = 0; i < docs[j].images.length; i++) {
          result =
            result +
            '<img width="200px" src="https://' +
            account +
            ".file.core.windows.net/" +
            fileShare +
            "/" +
            docs[j].images[i].name +
            sas +
            "&xyz=" +
            new Date().getTime().toString() +
            '" />';
        }
        html = html + result;
      }
      document.getElementById("datos").innerHTML = html;
    });
}
// Function execute on load
function displayAlbumsOnLoad() {
  client.auth
    .loginWithCredential(new stitch.AnonymousCredential())
    .then(displayalbums)
    .catch(console.error);
}
function insertAlbum(
  parNombre,
  parUbicacion,
  parCategoria,
  parDescripcion,
  parImages,
  parDestacados
) {
  // InsertOne
  db.collection("turismo")
    .insertOne({
      owner_id: client.auth.user.id,
      nombre: parNombre,
      ubicacion: parUbicacion,
      categoria: parCategoria,
      descripcion: parDescripcion,
      destacados: parDestacados,
      images: parImages,
    })
    .then(displayalbums);
}
function deleteAlbum(parId) {
  const query = { _id: new stitch.BSON.ObjectId(parId) };
  db.collection("turismo").deleteOne(query).then(displayalbums);
}

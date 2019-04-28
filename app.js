const express = require('express');
const ejs = require('ejs');
const bp = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

var webconfig = {
  user: 'dogukan',
  password: 'Cavus1234%',
  server: 'dogukancavus.database.windows.net',
  database: 'MEDIPILIMDB',
  options: {
    encrypt: true
  }
};

app.set('view engine', 'ejs');
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.redirect('/liste');
});

app.get('/liste', function(req, res) {
  sql.close();
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query(
      'select * from Album order by AlbumId; select * from Sanatci order by SanatciId; select * from MuzikTur order by MuzikTurId;',
      function(err, data) {
        if (err) {
          console.log(err);
        }
        sql.close();
        res.render('liste', { veri: data.recordsets });
        // console.log(data) ve console.log(data.recordsets) ile görülebilir
      }
    );
  });
});

app.get('/album_duzenleme_ekleme', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query('select SanatciId, SanatciAdi from Sanatci; select * from MuzikTur;', function(err, data) {
      if (err) {
        console.log(err);
      }
      sql.close();
      res.render('album_duzenleme_ekleme', { veri1: data.recordsets });
      // console.log(data) ve console.log(data.recordsets) ile görülebilir
    });
  });
});

app.get('/sanatci_duzenleme_ekleme', function(req, res) {
  res.render('sanatci_duzenleme_ekleme');
});

app.get('/muziktur_duzenleme_ekleme', function(req, res) {
  res.render('muziktur_duzenleme_ekleme');
});

app.get('/album_guncelleme', function(req, res) {
  res.render('album_guncelleme');
});

app.post('/album_guncelleme_post', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query('select SanatciId, SanatciAdi from Sanatci; select * from MuzikTur;', function(err, data) {
      if (err) {
        console.log(err);
      }
      sql.close();
      res.render('album_guncelleme', {
        veri: data.recordsets,
        album_id: req.body.albumId,
        album_adi: req.body.albumAdi,
        cikis_tarihi: req.body.cikisTarihi,
        sanatci_id: req.body.sanatciId,
        muziktur_id: req.body.muzikturId
      });
      // console.log(data) ve console.log(data.recordsets) ile görülebilir
    });
  });
});

app.post('/album_guncelleme', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    console.log(req.body);
    request1.query(
      `
    UPDATE Album
      set 
        AlbumAdi = '${req.body.albumAdi_G}', 
        CikisTarihi = '${req.body.cikisTarihi_G}', 
        SanatciId = ${req.body.sanatciId_G}, 
        MuzikTurId = ${req.body.muzikTurId_G}
      where
        AlbumId = ${req.body.albumId}
    `,
      function(err, data) {
        if (err) {
          console.log(err);
          return;
        }
        sql.close();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(`
        <html>
<head>
<style>
.a {
background-color:deeppink;
color:white;
padding:10px 20px;
border-radius:20px;
margin:20px;
font-family:'Segoe UI', Roboto, sans-serif;
text-decoration:none;
font-weight:600;
font-size:20px;
display:inline-block;
}

div {
font-family:'Segoe UI', Roboto, sans-serif;
margin:20px 20px 0 20px;
font-size:18px;
}
</style>
</head>
<body>
<div>${req.body.albumId} id'li albüm başarıyla güncellendi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
        `);
        res.end();
      }
    );
  });
});

app.post('/sanatci_guncelleme_post', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query('select * from Sanatci', function(err, data) {
      if (err) {
        console.log(err);
      }
      sql.close();
      res.render('sanatci_guncelleme', {
        veri: data.recordset,
        sanatci_id: req.body.sanatciId,
        sanatci_adi: req.body.sanatciAdi,
        sanatci_yasiyormu: req.body.sanatciYasiyormu,
        sanatci_dogum_tarihi: req.body.sanatciDogumTarihi
      });
      // console.log(data) ve console.log(data.recordsets) ile görülebilir
    });
  });
});

app.post('/sanatci_guncelleme', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    console.log(req.body);
    request1.query(
      `
    UPDATE Sanatci
      set 
        SanatciAdi = '${req.body.sanatciAdi_G}', 
        SanatciYasiyormu = '${req.body.sanatciYasiyormu_G}', 
        SanatciDogumTarihi = '${req.body.sanatciDogumTarihi_G}'
      where
        SanatciId = ${req.body.sanatciId}
    `,
      function(err, data) {
        if (err) {
          console.log(err);
        }
        sql.close();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(`
        <html>
<head>
<style>
.a {
background-color:deeppink;
color:white;
padding:10px 20px;
border-radius:20px;
margin:20px;
font-family:'Segoe UI', Roboto, sans-serif;
text-decoration:none;
font-weight:600;
font-size:20px;
display:inline-block;
}

div {
font-family:'Segoe UI', Roboto, sans-serif;
margin:20px 20px 0 20px;
font-size:18px;
}
</style>
</head>
<body>
<div>${req.body.sanatciId} id'li sanatçı başarıyla güncellendi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
        `);
        res.end();
      }
    );
  });
});

app.post('/muziktur_guncelleme_post', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    request1.query('select * from MuzikTur order by MuzikTurId', function(err, data) {
      if (err) {
        console.log(err);
      }
      sql.close();
      res.render('muziktur_guncelleme', {
        veri: data.recordset,
        muziktur_id: req.body.muzikTurId,
        muzik_turu: req.body.muzikTur
      });
      // console.log(data) ve console.log(data.recordsets) ile görülebilir
    });
  });
});

app.post('/muziktur_guncelleme', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    console.log(req.body);
    request1.query(
      `
    UPDATE MuzikTur
      set 
        MuzikTur = '${req.body.muzikTuru_G}'
      where
        MuzikTurId = ${req.body.muzikturId};

    `,
      function(err, data) {
        if (err) {
          console.log(err);
        }
        sql.close();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(`
        <html>
<head>
<style>
.a {
background-color:deeppink;
color:white;
padding:10px 20px;
border-radius:20px;
margin:20px;
font-family:'Segoe UI', Roboto, sans-serif;
text-decoration:none;
font-weight:600;
font-size:20px;
display:inline-block;
}

div {
font-family:'Segoe UI', Roboto, sans-serif;
margin:20px 20px 0 20px;
font-size:18px;
}
</style>
</head>
<body>
<div>${req.body.muzikturId} id'li müzik türü başarıyla güncellendi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
        `);
        res.end();
      }
    );
  });
});

app.post('/album_sil', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    console.log(req.body);
    request1.query(
      `
      DELETE Album
      where AlbumId = ${req.body.delete_input1};
    `,
      function(err, data) {
        if (err) {
          console.log(err);
        }
        sql.close();
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.write(`
        <html>
<head>
<style>
.a {
background-color:deeppink;
color:white;
padding:10px 20px;
border-radius:20px;
margin:20px;
font-family:'Segoe UI', Roboto, sans-serif;
text-decoration:none;
font-weight:600;
font-size:20px;
display:inline-block;
}

div {
font-family:'Segoe UI', Roboto, sans-serif;
margin:20px 20px 0 20px;
font-size:18px;
}
</style>
</head>
<body>
<div>${req.body.delete_input1} id'li Album Başarıyla Silindi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
        `);
        res.end();
      }
    );
  });
});

app.post('/sanatci_sil', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    console.log(req.body);
    request1.query(
      `
      DELETE Sanatci
      where SanatciId = ${req.body.delete_input2}
    `,
      function(err, data) {
        if (err) {
          console.log(`Bu Sanatçı, Albüm tablosundaki bir kayıtta kullanıldığı için silinemedi. Original Error: ${err}`);
          sql.close();
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.write(`
          <html>
<head>
<style>
.a {
  background-color:deeppink;
  color:white;
  padding:10px 20px;
  border-radius:20px;
  margin:20px;
  font-family:'Segoe UI', Roboto, sans-serif;
  text-decoration:none;
  font-weight:600;
  font-size:20px;
  display:inline-block;
}

div {
  font-family:'Segoe UI', Roboto, sans-serif;
  margin:20px 20px 0 20px;
  font-size:18px;
}
</style>
</head>
<body>
<div>Bu Sanatçı, Albüm tablosundaki bir kayıtta kullanıldığı için silinemedi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
          `);
          res.end();
        } else {
          sql.close();
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.write(`
          <html>
<head>
<style>
.a {
  background-color:deeppink;
  color:white;
  padding:10px 20px;
  border-radius:20px;
  margin:20px;
  font-family:'Segoe UI', Roboto, sans-serif;
  text-decoration:none;
  font-weight:600;
  font-size:20px;
  display:inline-block;
}

div {
  font-family:'Segoe UI', Roboto, sans-serif;
  margin:20px 20px 0 20px;
  font-size:18px;
}
</style>
</head>
<body>
<div>${req.body.delete_input2} id'li Sanatçı Başarıyla Silindi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
          `);
          res.end();
        }
      }
    );
  });
});

app.post('/muzik_tur_sil', function(req, res) {
  sql.connect(webconfig, function(err) {
    if (err) console.log(err);
    var request1 = new sql.Request();
    console.log(req.body);
    request1.query(
      `
      DELETE MuzikTur
      where MuzikTurId = ${req.body.delete_input3}
    `,
      function(err, data) {
        if (err) {
          console.log(`Bu Müzik Türü, Albüm tablosundaki bir kayıtta kullanıldığı için silinemedi. Original Error : ${err}`);
          sql.close();
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.write(`
<html>
<head>
<style>
.a {
  background-color:deeppink;
  color:white;
  padding:10px 20px;
  border-radius:20px;
  margin:20px;
  font-family:'Segoe UI', Roboto, sans-serif;
  text-decoration:none;
  font-weight:600;
  font-size:20px;
  display:inline-block;
}

div {
  font-family:'Segoe UI', Roboto, sans-serif;
  margin:20px 20px 0 20px;
  font-size:18px;
}
</style>
</head>
<body>
<div>Bu Müzik Türü, Albüm tablosundaki bir kayıtta kullanıldığı için silinemedi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
          `);
          res.end();
        } else {
          sql.close();
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.write(`
          <html>
<head>
<style>
.a {
  background-color:deeppink;
  color:white;
  padding:10px 20px;
  border-radius:20px;
  margin:20px;
  font-family:'Segoe UI', Roboto, sans-serif;
  text-decoration:none;
  font-weight:600;
  font-size:20px;
  display:inline-block;
}

div {
  font-family:'Segoe UI', Roboto, sans-serif;
  margin:20px 20px 0 20px;
  font-size:18px;
}
</style>
</head>
<body>
<div>${req.body.delete_input3} id'li Müzik Türü Başarıyla Silindi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
          `);
          res.end();
        }
      }
    );
  });
});

// Change execute query to accept parameters.
var executeQuery = function(res, query, parameters, isim) {
  sql.connect(webconfig, function(err) {
    if (err) {
      console.log('there is a database connection error -> ' + err);
      res.send(err);
    } else {
      // create request object
      var request = new sql.Request();
      // Add parameters
      parameters.forEach(function(p) {
        request.input(p.name, p.sqltype, p.value);
      });

      // query to the database
      request.query(query, function(err, result) {
        if (err) {
          console.log('error while querying database -> ' + err);
          sql.close();
          res.send(err);
        } else {
          sql.close();
          // res.send(result);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.write(`
          <html>
<head>
<style>
.a {
  background-color:deeppink;
  color:white;
  padding:10px 20px;
  border-radius:20px;
  margin:20px;
  font-family:'Segoe UI', Roboto, sans-serif;
  text-decoration:none;
  font-weight:600;
  font-size:20px;
  display:inline-block;
}

div {
  font-family:'Segoe UI', Roboto, sans-serif;
  margin:20px 20px 0 20px;
  font-size:18px;
}
</style>
</head>
<body>
<div>${isim} başarıyla eklendi.</div>
<a class="a" href="/liste">LİSTEYE DÖN</a>
</body>
</html>
          `);
          res.end();
        }
      });
    }
  });
};

//POST API
app.post('/album_post', function(req, res) {
  var parameters = [
    { name: 'AlbumAdi', sqltype: sql.NVarChar, value: req.body.albumAdi },
    { name: 'CikisTarihi', sqltype: sql.Date, value: req.body.cikisTarihi },
    { name: 'SanatciId', sqltype: sql.Int, value: req.body.sanatciId },
    { name: 'MuzikTurId', sqltype: sql.Int, value: req.body.muzikTurId }
  ];

  var query = `
  INSERT INTO [Album] (AlbumAdi,CikisTarihi, SanatciId, MuzikTurId) 
  VALUES (@AlbumAdi, @CikisTarihi, @SanatciId, @MuzikTurId)`;
  executeQuery(res, query, parameters, req.body.albumAdi);
});

app.post('/sanatci_post', function(req, res) {
  var parameters = [
    { name: 'SanatciAdi', sqltype: sql.NVarChar, value: req.body.sanatciAdi },
    { name: 'SanatciYasiyormu', sqltype: sql.Bit, value: parseInt(req.body.sanatciYasiyormu) },
    { name: 'SanatciDogumTarihi', sqltype: sql.Int, value: req.body.sanatciDogumTarihi },
    { name: 'EklenmeTarihi', sqltype: sql.Date, value: new Date() }
  ];

  var query = `
  INSERT INTO [Sanatci] (SanatciAdi,SanatciYasiyormu,SanatciDogumTarihi,EklenmeTarihi) 
  VALUES (@SanatciAdi, @SanatciYasiyormu, @SanatciDogumTarihi, GETDATE())`;
  executeQuery(res, query, parameters, req.body.sanatciAdi);
});

app.post('/muziktur_post', function(req, res) {
  var parameters = [{ name: 'MuzikTur', sqltype: sql.NVarChar, value: req.body.muzikTur }];

  var query = `
  INSERT INTO [MuzikTur] (MuzikTur) 
  VALUES (@MuzikTur)`;
  executeQuery(res, query, parameters, req.body.muzikTur);
});

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
  res.status(404);
  res.render('404');
});

app.listen(port, function() {
  console.log(`Baglanildi.  localhost:${port}/liste ile anasayfaya gidin.`);
});

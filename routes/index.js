const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
var validate = require('jsonschema').validate;
// const connectionString = 'postgres://postgres:root@localhost:5432/serasinha';
// const connectionString = 'postgres://ucixjqptisygvk:54186cd2c800073345993e7786180d6a14982d83ed577348861c3f57ac5316e5@ec2-184-73-159-137.compute-1.amazonaws.com:5432/dd1beij8g7kih0';
const connectionString = 'postgres://qbwibpqzpiyxfl:f31a707c4d8be72ef62d314accb54b8f0018c1c12f7aa217b5bd29764a1949fc@ec2-54-163-238-169.compute-1.amazonaws.com:5432/def6kqeml1q39h';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Serasinha' });
});

/* GET home page. */
router.get('/instrucoes', function(req, res, next) {
	res.render('instrucoes', { title: 'Instruções de utilização' });
});

/* GET parceiro create page. */
router.get('/create', function(req, res, next) {
	res.render('parceiro/create', { title: 'Cadastrar Parceiro' });
});

/* GET parceiro read page. */
router.get('/read', function(req, res, next) {
	res.render('parceiro/read', { title: 'Ver Parceiros' });
});

/* GET parceiro edit page. */
router.get('/edit', function(req, res, next) {
	res.render('parceiro/edit', { title: 'Editar Parceiro' });
});

//GET pega os dados dos parceiros
router.get('/parceiro', (req, res, next) => {
	const results = [];
	pg.connect(connectionString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(500).json({
				success: false, data: err
			});
		}
		const query = client.query('SELECT * FROM cad_parceiro ORDER BY id_parceiro ASC;');
		query.on('row', (row) => {
			results.push(row);
		});
		query.on('end', () => {
			done();
			if(!results.length) {
				return res.status(500).json({success: false, data: 'Não há parceiros cadastrados ainda!'});
			} else {
				return res.json(results);
			}
		});
	});
});

/* GET parceiro edit page (dados jasao). */
router.get('/parceiro/:id_parceiro', function(req, res, next) {
	const results = [];
	const id_parceiro = req.params.id_parceiro
	pg.connect(connectionString, (err, client, done) => {

		if(err) {
			done();
			console.log(err);
			return res.status(500).json({success: false, data: err});
		}

		const query = client.query("SELECT * FROM cad_parceiro WHERE id_parceiro=($1) ORDER BY id_parceiro ASC", [id_parceiro]);

		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', function() {
			done();
			if(!results.length) {
				return res.status(500).json({success: false, data: 'Não há parceiro para o ID correspondente'});
			} else {
				return res.json({success: true, data: results});
			}
		});
	});
});

//faz um post e entao um insert na tabela cad_parceiro do banco serasa
router.post('/parceiro', (req, res, next) => {
	const results = [];
	const data = {
		cnpj: req.body.cnpj,
		nome_fantasia: req.body.nome_fantasia,
		razao_social: req.body.razao_social,
		nome_usuario: req.body.nome_usuario, 
		email: req.body.email, 
		senha: req.body.senha 
	};

	var parceiroSchema = {
		"cnpj": {"type": "string"},
		"nome_fantasia": {"type": "string"},
		"nome_usuario": {"type": "string"},
		"nome_fantasia": {"type": "string"},
		"senha": {"type": "string"},
		"razao_social": {"type": "string"}
  	};

	if(!validate(req.body, parceiroSchema)){
		return res.status(400).json({success: false});
	}
	
	pg.connect(connectionString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(400).json({success: false, data: err});
		}

		const query = client.query("SELECT * FROM cad_parceiro WHERE cnpj=($1) OR email=($2)",
			[data.cnpj, data.email],
			function(err, result){
			done();
			if (result.rowCount > 0) {
				return res.status(409).json({success: false});
			}
		})
		.done(function(){
			client.query('INSERT INTO cad_parceiro(cnpj, nome_fantasia, razao_social, nome_usuario, email, senha) values($1, $2, $3, $4, $5, $6) RETURNING id_parceiro', 
				[data.cnpj, data.nome_fantasia, data.razao_social, data.nome_usuario, data.email, data.senha],
				function(err, result){
					done();
					if(err) {
						return res.status(422).json({success: false, data: 'Houve alguma falha na gravação, por favor contate o administrador do sistema.'});
					} else {
						return res.json({success: true, data: result.rows[0].id_parceiro});
					}
				}
			);
		});
		
	});
});

//faz um update no parceiro
router.put('/parceiro/:id_parceiro', (req, res, next) => {
	const id_parceiro = req.params.id_parceiro
	const data = {
		cnpj: req.body.cnpj,
		nome_fantasia: req.body.nome_fantasia,
		razao_social: req.body.razao_social,
		nome_usuario: req.body.nome_usuario,
		email: req.body.email,
		senha: req.body.senha
	};

	pg.connect(connectionString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(400).json({success: false, data: err});
		}
		client.query('UPDATE cad_parceiro SET cnpj=($1), nome_fantasia=($2), razao_social=($3), nome_usuario=($4), email=($5), senha=($6) WHERE id_parceiro=($7)',
			[data.cnpj, data.nome_fantasia, data.razao_social, data.nome_usuario, data.email, data.senha, id_parceiro],
			function(err, result){
				done();
				if(err) {
					return res.status(422).json({success: false, data: 'Houve alguma falha na atualização do parceiro, por favor contate o administrador do sistema.'});
				} else {
					return res.json({success: true, data: 'Sucesso ao atualizar!'});
				}
			}
		);
	});
});

router.delete('/parceiro/:id_parceiro', (req, res, next) => {
	const results = [];
	const id_parceiro = req.params.id_parceiro;
	pg.connect(connectionString, (err, client, done) => {
		if(err) {
			done();
			console.log(err);
			return res.status(400).json({success: false, data: err});
		}

		client.query('DELETE FROM cad_parceiro WHERE id_parceiro=($1)', [id_parceiro]);
		var query = client.query('SELECT * FROM cad_parceiro WHERE id_parceiro=($1) ORDER BY id_parceiro ASC', [id_parceiro]);
		
		query.on('row', (row) => {
			results.push(row);
		});

		query.on('end', function() {
			done();
			if(results.length) {
				return res.status(422).json({success: false, data: 'Houve alguma falha na exclusão do parceiro, por favor contate o administrador do sistema.'});
			} else {
				return res.json({success: true, data: 'Sucesso ao excluir!'});
			}
		});
		
	});
});


module.exports = router;

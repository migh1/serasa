const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
var Ajv = require('ajv');
var schema = {
	"properties": {
		"cnpj": { "type": "string" },
		"nome_fantasia": { "type": "string" },
		"razao_social": { "type": "string" },
		"nome_usuario": { "type": "string" },
		"email": { "type": "string" },
		"senha": { "type": "string" }
	},
	"required": ["cnpj", "nome_fantasia", "razao_social", "nome_usuario", "email", "senha"]
};
var schema_cliente = {
	"properties": {
		"nome_cliente": { "type": "string" },
		"cpf": { "type": "string" }
	},
	"required": ["nome_cliente", "cpf"]
};
var schema_titulo = {
	"properties": {
		"id_cliente": { "type": "string" },
		"id_parceiro": { "type": "string" },
		"valor": { "type": "string" },
		"descricao": { "type": "string" },
		"situacao": { "type": "string" },
		"data_emissao": { "type": "string" },
		"data_pagamento": { "type": "string" },
	},
	"required": ["id_cliente", "id_parceiro", "valor", "descricao", "situacao", "data_emissao"]
};
var edit_schema = {
	"properties": {
		"nome_fantasia": { "type": "string" },
		"razao_social": { "type": "string" },
		"email": { "type": "string" },
		"senha": { "type": "string" }
	},
	"required": ["nome_fantasia", "razao_social", "email", "senha"]
};
var edit_schema_cliente = {
	"properties": {
		"cpf": { "type": "string" },
		"nome_cliente": { "type": "string" }
	},
	"required": ["cpf", "nome_cliente"]
};
var edit_schema_titulo = {
	"properties": {
		"valor": { "type": "string" },
		"descricao": { "type": "string" },
		"situacao": { "type": "string" },
		"data_emissao": { "type": "string" },
		"data_pagamento": { "type": "string" }
	}
};
var login_schema = {
	"properties": {
		"nome_usuario": {"type": "string"},
		"senha": {"type": "string"}
	},
	"required": ["nome_usuario", "senha"]
};
var ajv = new Ajv();
var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
// const connectionString = 'postgres://postgres:root@localhost:5432/serasinha';
const connectionString = 'postgres://ckayytwunbhznl:f3e3e1c882f166c26e1396c71a3e5ae51e8cb136fe97fd351df00b81223f38b9@ec2-54-163-238-169.compute-1.amazonaws.com:5432/def6kqeml1q39h';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Serasinha' });
});

/* GET home page. */
router.get('/instrucoes', function(req, res, next) {
	res.render('instrucoes', { title: 'Instruções de utilização' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('parceiro/login', { title: 'Login Parceiro' });
});

/* GET logout page. */
router.get('/logout', function(req, res, next) {
	res.render('parceiro/logout', { title: 'Logout Parceiro' });
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
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			var results;
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(500).json({
						success: false, data: err
					});
				} else {
					const query = client.query('SELECT cnpj, nome_fantasia, razao_social, nome_usuario, email FROM cad_parceiro WHERE token=($1) ORDER BY id_parceiro ASC;', [req.headers.authorization]);
					query.on('row', (row) => {
						results = row;
					});
					query.on('end', () => {
						done();
						if(results.length > 0) {
							return res.status(500).json({success: false, data: 'Não há parceiros cadastrados ainda!'});
						} else {
							client.query("SELECT cnpj, nome_fantasia, razao_social, nome_usuario, email FROM cad_parceiro WHERE token=($1) AND ativo=($2) ORDER BY id_parceiro ASC",[req.headers.authorization, 'true'], function(err, result){
								done();
								if (result.rowCount <= 0) {
									return res.status(409).json({success: false, http: 409, mensagem: 'Parceiro inativo, verifique.'});
								} else {
									return res.status(200).json(results);
								}
							});
						}
					});
				}
			});
		}
	});
});

/* GET parceiro edit page (dados jasao). */
router.get('/parceiro/:id_parceiro', function(req, res, next) {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
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
		}
	});
});

//faz um post e entao um insert na tabela cad_parceiro do banco serasa
router.post('/parceiro', (req, res, next) => {
	if(!ajv.validate(schema, req.body)){
		return res.status(400).json({success: false, http: 400, mensagem: 'JSON schema inválido, verifique.'});
	} else {
		pg.connect(connectionString, (err, client, done) => {
			if(err) {
				done();
				console.log(err);
				return res.status(400).json({success: false, http: 400, mensagem: 'Erro ao se conectar com o banco.'});
			}

			const query = client.query("SELECT * FROM cad_parceiro WHERE cnpj=($1) OR email=($2)",[req.body.cnpj, req.body.email], function(err, result){
				done();
				if (result.rowCount > 0) {
					return res.status(409).json({success: false, http: 409, mensagem: 'CNPJ ou Email já cadastrado, verifique.'});
				} else {
					client.query('INSERT INTO cad_parceiro(cnpj, nome_fantasia, razao_social, nome_usuario, email, senha) values($1, $2, $3, $4, $5, $6) RETURNING id_parceiro', 
						[req.body.cnpj, req.body.nome_fantasia, req.body.razao_social, req.body.nome_usuario, req.body.email, req.body.senha],
						function(err, result){
							done();
							if(err) {
								return res.status(422).json({success: false, http: 422, mensagem: 'Falha na validação dos dados, por favor verifique o JSON enviado.'});
							} else {
								return res.json({success: true, data: result.rows[0].id_parceiro});
							}
						}
					);
				}
			});
		});
	}
});

//faz login no parceiro
router.put('/login', (req, res, next) => {
  	if(!ajv.validate(login_schema, req.body)){
		return res.status(400).json({success: false, http: 400, mensagem: 'JSON inválido.'});
	} else {
		pg.connect(connectionString, (err, client, done) => {
			if(err) {
				done();
				return res.status(400).json({success: false, http: 400, mensagem: 'Erro na conexão do banco de dados.'});
			}
			const query = client.query("SELECT * FROM cad_parceiro WHERE nome_usuario=($1) AND senha=($2)", [req.body.nome_usuario, req.body.senha], function(err, result){
				done();
				if (result.rowCount == 0) {
					return res.status(404).json({success: false, http: 404, mensagem: 'Usuário não encontrado.'});
				} else {
					client.query("SELECT * FROM cad_parceiro WHERE nome_usuario=($1) AND senha=($2) AND ativo=($3)", [req.body.nome_usuario, req.body.senha, 'true'], function(err, result){
						done();
						if (result.rowCount == 0) {
							return res.status(404).json({success: false, http: 404, mensagem: 'Usuário não encontrado ou parceiro inativo, verifique.'});
						} else {

							var token = MD5(req.body.nome_usuario+'##'+req.body.senha);
							client.query('UPDATE cad_parceiro SET token=($1), data_adicionado=($2) WHERE nome_usuario=($3) and senha=($4)', [token, 'now()', req.body.nome_usuario, req.body.senha], function(err, result){
									done();
									if(err) {
										return res.status(422).json({success: false, http: 422, mensagem: 'Erro na geração do token.'});
									} else {
										return res.json({token: token});
									}
								}
							);
						}
					});
				}
			});
		});
	}
});

//faz login no parceiro
router.put('/logout', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Usuário não autorizado a deslogar, pois não está logado.'});
		} else {
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					return res.status(400).json({success: false, http: 400, mensagem: 'Erro na conexão do banco de dados.'});
				}
				client.query('UPDATE cad_parceiro SET token=($1), data_adicionado=($2) WHERE token=($3)', [null, null, req.headers.authorization], function(err, result){
					done();
					if(err) {
						return res.status(422).json({success: false, http: 422, mensagem: 'Erro no logout, por favor tente novamente.'});
					} else {
						return res.status(200).json({success: true, http: 200, mensagem: 'Usuário deslogado com sucesso.'});
					}
				});
			});
		}
	});
});

//faz um update no parceiro
router.put('/parceiro', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			if(!ajv.validate(edit_schema, req.body)){
				return res.status(400).json({success: false, http: 400, mensagem: 'JSON schema inválido, verifique.'});
			} else {
				pg.connect(connectionString, (err, client, done) => {
					if(err) {
						done();
						console.log(err);
						return res.status(400).json({success: false, data: err});
					}
					const query = client.query("SELECT * FROM cad_parceiro WHERE email=($1)",[req.body.email], function(err, result){
						done();
						if (result.rowCount > 0) {
							return res.status(409).json({success: false, http: 409, mensagem: 'Email já cadastrado, verifique.'});
						} else {
							client.query("SELECT * FROM cad_parceiro WHERE email=($1) AND ativo=($2)",[req.body.email, 'true'], function(err, result){
								if (result.rowCount > 0) {
									return res.status(409).json({success: false, http: 409, mensagem: 'Parceiro inativo, verifique.'});
								} else {
									client.query('UPDATE cad_parceiro SET nome_fantasia=($1), razao_social=($2), email=($3), senha=($4) WHERE token=($5)',
										[req.body.nome_fantasia, req.body.razao_social, req.body.email, req.body.senha, req.headers.authorization],
										function(err, result){
											done();
											if(err) {
												return res.status(422).json({success: false, data: 'Houve alguma falha na atualização do parceiro, por favor contate o administrador do sistema.'});
											} else {
												return res.json({success: true, data: 'Sucesso ao atualizar!'});
											}
										}
									);
								}
							});
						}
					});
				});
			}
		}
	});
});

router.delete('/parceiro', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			const results = [];
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(400).json({success: false, data: err});
				}

				client.query('UPDATE cad_parceiro SET ativo=($1) WHERE token=($2)', ['false', req.headers.authorization]);
				var query = client.query('SELECT * FROM cad_parceiro WHERE token=($1) ORDER BY id_parceiro ASC', [req.headers.authorization]);
				
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
		}
	});
});

router.post('/verify/login/user/path', (req, res, next)=>{
	const data = {token: req.headers.authorization};
	var loginSchema = {"token": {"type": "string"}};

	if(!v.validate(data, loginSchema)){
		return res.status(400).json({success: false});
	} else {
		isLogado(data.token, function(err, valid){
			if(!valid){
				return res.status(400).json({success: false, http: 400, mensagem: 'Usuário não está logado.'});
			} else {
				return res.status(200).json({success: false, http: 200, mensagem: 'Usuário está logado.'});
			}
		});
	}
});

/* GET cliente create page. */
router.get('/cliente/create', function(req, res, next) {
	res.render('cliente/create', { title: 'Cadastrar Cliente' });
});

/* GET cliente read page. */
router.get('/cliente/read', function(req, res, next) {
	res.render('cliente/read', { title: 'Visualizar Clientes' });
});

//GET pega os dados dos clientes
router.get('/cliente', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			var results = [];
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(500).json({
						success: false, mensagem: err
					});
				} else {
					const query = client.query('SELECT cc.id_cliente, cc.nome as nome_cliente, cc.cpf FROM cad_cliente cc, cad_parceiro cp WHERE cp.token=($1) ORDER BY cc.id_cliente ASC;', [req.headers.authorization]);
					query.on('row', (row) => {
						results.push(row)
					});
					query.on('end', () => {
						done();
						if(!results.length) {
							return res.status(500).json({success: false, mensagem: 'Não há clientes cadastrados ainda!'});
						} else {
							client.query('SELECT cc.id_cliente, cc.nome, cc.cpf FROM cad_cliente cc, cad_parceiro cp WHERE cp.token=($1) ORDER BY cc.id_cliente ASC;', [req.headers.authorization],  function(err, result){
								done();
								if (result.rowCount <= 0) {
									return res.status(409).json({success: false, http: 409, mensagem: 'Parceiro inativo, verifique.'});
								} else {
									return res.status(200).json(results);
								}
							});
						}
					});
				}
			});
		}
	});
});

//faz um post e entao um insert na tabela cad_cliente do banco serasa
router.post('/cliente', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		req.body.cpf = req.body.cpf.replace(/\D/g, '');
		if(!ajv.validate(schema_cliente, req.body)){
			return res.status(400).json({success: false, http: 400, mensagem: 'JSON schema inválido, verifique.'});
		} else {
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(400).json({success: false, http: 400, mensagem: 'Erro ao se conectar com o banco.'});
				}

				const query = client.query("SELECT * FROM cad_cliente WHERE cpf=($1)",[req.body.cpf], function(err, result){
					done();
					if (result.rowCount > 0) {
						return res.status(409).json({success: false, http: 409, mensagem: 'CPF já cadastrado, verifique.'});
					} else {
						client.query('INSERT INTO cad_cliente(nome, cpf) values($1, $2) RETURNING id_cliente', 
							[req.body.nome_cliente, req.body.cpf],
							function(err, result){
								done();
								if(err) {
									return res.status(422).json({success: false, http: 422, mensagem: 'Falha na validação dos dados, por favor verifique o JSON enviado.'});
								} else {
									return res.json({success: true, mensagem: result.rows[0].id_cliente});
								}
							}
						);
					}
				});
			});
		}
	});
});

//faz um delete do cliente
router.delete('/cliente/:id_cliente', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			const results = [];
			var id_cliente = req.params.id_cliente.length == 0 ? null : ''+req.params.id_cliente;
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(400).json({success: false, mensagem: err});
				}

				client.query('DELETE FROM cad_cliente WHERE id_cliente=($1)', [id_cliente]);
				var query = client.query('SELECT * FROM cad_cliente WHERE id_cliente=($1) ORDER BY id_cliente ASC', [id_cliente]);
				
				query.on('row', (row) => {
					results.push(row);
				});

				query.on('end', function() {
					done();
					if(results.length) {
						return res.status(422).json({success: false, mensagem: 'Houve alguma falha na exclusão do cliente, por favor contate o administrador do sistema.'});
					} else {
						return res.json({success: true, mensagem: 'Sucesso ao excluir!'});
					}
				});
			});
		}
	});
});

//faz um update no parceiro
router.put('/cliente/:id_cliente', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			req.body.cpf = req.body.cpf.replace(/\D/g, '');
			if(!ajv.validate(edit_schema_cliente, req.body)){
				return res.status(400).json({success: false, http: 400, mensagem: 'JSON schema inválido, verifique.'});
			} else {
				if (req.params.id_cliente == null) {
					return res.status(400).json({success: false, http: 400, mensagem: 'Cliente ID inválido, verifique.'});
				}else{
					var id_cliente = req.params.id_cliente;
					pg.connect(connectionString, (err, client, done) => {
						if(err) {
							done();
							console.log(err);
							return res.status(400).json({success: false, mensagem: err});
						}
						const query = client.query("SELECT * FROM cad_cliente WHERE id_cliente=($1)",[id_cliente], function(err, result){
							done();
							if (result.rowCount == 0) {
								return res.status(422).json({success: false, http: 422, mensagem: 'ID do cliente enviado não existe, verifique.'});
							} else {
								client.query("SELECT * FROM cad_parceiro WHERE token=($1) AND ativo=($2)",[req.headers.authorization, 'true'], function(err, result){
									if (result.rowCount == 0) {
										return res.status(422).json({success: false, http: 422, mensagem: 'Parceiro inativo, verifique.'});
									} else {
										client.query('UPDATE cad_cliente SET nome=($1), cpf=($2) WHERE id_cliente=($3)', [req.body.nome_cliente, req.body.cpf, id_cliente], function(err, result){
											done();
											if(err) {
												return res.status(422).json({success: false, mensagem: 'Houve alguma falha na atualização do parceiro, por favor contate o administrador do sistema.'});
											} else {
												return res.json({success: true, mensagem: 'Sucesso ao atualizar cliente!'});
											}
										});
									}
								});
							}
						});
					});
				}
			}
		}
	});
});

/* GET titulo create page. */
router.get('/titulo/create', function(req, res, next) {
	res.render('titulo/create', { title: 'Cadastrar Titulo' });
});

/* GET titulo read page. */
router.get('/titulo/read', function(req, res, next) {
	res.render('titulo/read', { title: 'Visualizar Titulos' });
});

//GET pega os dados dos titulo
router.get('/titulo', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			var results = [];
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(500).json({
						success: false, mensagem: err
					});
				} else {
					const query = client.query('SELECT \
													*,\
													cc.nome as nome_cliente\
												FROM \
													cad_titulo ct\
													inner join cad_parceiro cp ON cp.id_parceiro = ct.id_parceiro\
													inner join cad_cliente cc ON cc.id_cliente = ct.id_cliente\
												WHERE \
													cp.token=($1) AND cp.ativo=($2) \
												ORDER BY \
													ct.id_titulo ASC;', 
												[req.headers.authorization, 'true']
												);
					query.on('row', (row) => {
						results.push(row)
					});
					query.on('end', () => {
						done();
						if(!results.length) {
							return res.status(500).json({success: false, mensagem: 'Parceiro inativo ou token invalida, verifique.'});
						} else {
							return res.status(200).json(results);
						}
					});
				}
			});
		}
	});
});

//GET pega os dados do titulo especifico
router.get('/titulo/:id_titulo', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			var results = [];
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(500).json({
						success: false, mensagem: err
					});
				} else {
					const query = client.query('SELECT \
													*,\
													cc.nome as nome_cliente\
												FROM \
													cad_titulo ct\
													inner join cad_parceiro cp ON cp.id_parceiro = ct.id_parceiro\
													inner join cad_cliente cc ON cc.id_cliente = ct.id_cliente\
												WHERE \
													cp.token=($1) AND cp.ativo=($2) AND cp.id_titulo=($3)\
												ORDER BY \
													ct.id_titulo ASC;', 
												[req.headers.authorization, 'true', id_titulo]
												);
					query.on('row', (row) => {
						results.push(row)
					});
					query.on('end', () => {
						done();
						if(!results.length) {
							return res.status(500).json({success: false, mensagem: 'Parceiro inativo ou id_titulo inexistente, verifique.'});
						} else {
							return res.status(200).json(results);
						}
					});
				}
			});
		}
	});
});

//faz um post e entao um insert na tabela cad_cliente do banco serasa
router.post('/titulo', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		pg.connect(connectionString, (err, client, done) => {
			if(err) {
				done();
				console.log(err);
				return res.status(400).json({success: false, http: 400, mensagem: 'Erro ao se conectar com o banco.'});
			}
			const query = client.query("SELECT cp.id_parceiro, cc.id_cliente FROM cad_parceiro cp, cad_cliente cc WHERE cp.token=($1) AND cc.id_cliente=($2)",[req.headers.authorization, req.body.id_cliente], function(err, result){
				done();
				if (result.rowCount == 0) {
					return res.status(404).json({success: false, http: 404, mensagem: 'Parceiro ou Cliente não encontrado, verifique.'});
				} else {
					req.body.id_parceiro = ''+result.rows[0].id_parceiro;

					if(!ajv.validate(schema_titulo, req.body)){
						return res.status(400).json({success: false, http: 400, mensagem: 'JSON schema inválido, verifique.'});
					} else {
						var query_insert = client.query('INSERT INTO cad_titulo(id_parceiro, id_cliente, valor, descricao, situacao, data_emissao, data_pagamento) values($1, $2, $3, $4, $5, $6, $7) RETURNING id_titulo', 
							[req.body.id_parceiro, req.body.id_cliente, req.body.valor, req.body.descricao, req.body.situacao, req.body.data_emissao, req.body.data_pagamento],
							function(err, result){
								done();
								if(err) {
									return res.status(422).json({success: false, http: 422, mensagem: 'Falha na gravação, por favor verifique o JSON enviado.'});
								} else {
									return res.json({success: true, mensagem: result.rows[0].id_titulo});
								}
							}
						);
					}
				}
			});
		});
	});
});

//faz um delete do cliente
router.delete('/titulo/:id_titulo', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			if (req.params.id_titulo == null) {
				return res.status(400).json({success: false, http: 400, mensagem: 'ID do tituloe esta vazio, verifique.'});
			} else {
				const results = [];
				var id_titulo = req.params.id_titulo;
				pg.connect(connectionString, (err, client, done) => {
					if(err) {
						done();
						console.log(err);
						return res.status(400).json({success: false, mensagem: err});
					}

					client.query('UPDATE cad_titulo SET situacao=($1) WHERE id_titulo=($2) AND situacao=($3)', ['0', id_titulo, '1'], function(err, result){
						if (err) {
							done();
							return res.status(422).json({success: false, http:422, mensagem: 'Houve alguma falha no cancelamento do titulo, por favor contate o administrador do sistema.'});
						} else if(result.rowCount == 0){
							return res.status(422).json({success: false, http:422, mensagem: 'Não é possível cancelar este titulo, verifique se a situacao é 1 (Aberto)'});
						} else {
							return res.json({success: true, mensagem: 'Sucesso ao cancelar!'});
						}
					});
				});
			}
		}
	});
});

//faz um update no parceiro
router.put('/titulo/:id_titulo', (req, res, next) => {
	isLogado(req.headers.authorization, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			if(!ajv.validate(edit_schema_titulo, req.body)){
				return res.status(400).json({success: false, http: 400, mensagem: 'JSON schema inválido, verifique.'});
			} else {
				var id_titulo = req.params.id_titulo.length == 0 ? null : ''+req.params.id_titulo;
				pg.connect(connectionString, (err, client, done) => {
					if(err) {
						done();
						console.log(err);
						return res.status(400).json({success: false, mensagem: err});
					}
					const query = client.query("SELECT * FROM cad_cliente WHERE id_titulo=($1)",[id_titulo], function(err, result){
						done();
						if (result.rowCount == 0) {
							return res.status(422).json({success: false, http: 422, mensagem: 'ID do cliente enviado não existe, verifique.'});
						} else {
							client.query("SELECT * FROM cad_parceiro WHERE token=($1) AND ativo=($2)",[req.headers.authorization, 'true'], function(err, result){
								if (result.rowCount == 0) {
									return res.status(422).json({success: false, http: 422, mensagem: 'Parceiro inativo, verifique.'});
								} else {
									client.query('UPDATE cad_cliente SET nome=($1) WHERE id_titulo=($2)', [req.body.nome_cliente, id_titulo], function(err, result){
										done();
										if(err) {
											return res.status(422).json({success: false, mensagem: 'Houve alguma falha na atualização do parceiro, por favor contate o administrador do sistema.'});
										} else {
											return res.json({success: true, mensagem: 'Sucesso ao atualizar cliente!'});
										}
									});
								}
							});
						}
					});
				});
			}
		}
	});
});

function isLogado (token, callback){
	const login = {token: token};
	var loginSchema = {
		"properties": {
			"token": {"type": "string"}
		},
		"required": ["token"]
	};

  	if(ajv.validate(loginSchema, login)){
		pg.connect(connectionString, (err, client, done) => {
			if(!err) {
				done();
				const query = client.query("SELECT * FROM cad_parceiro WHERE token=($1)", [login.token], function(err, result){
					done();
					if (result.rowCount == 0) {
						callback(null, false);
					} else {
						callback(null, true);
					}
				});
			} else {callback(null, false);}
		});
	} else {callback(null, false);}
}

module.exports = router;

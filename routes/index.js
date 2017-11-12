const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
var validate = require('jsonschema').validate;
var MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};
// const connectionString = 'postgres://postgres:root@localhost:5432/serasinha';
const connectionString = 'postgres://qbwibpqzpiyxfl:f31a707c4d8be72ef62d314accb54b8f0018c1c12f7aa217b5bd29764a1949fc@ec2-54-163-238-169.compute-1.amazonaws.com:5432/def6kqeml1q39h';

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
	isLogado(req.headers.token, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
			const results = [];
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					console.log(err);
					return res.status(500).json({
						success: false, data: err
					});
				} else {
					const query = client.query('SELECT cnpj, nome_fantasia, razao_social, nome_usuario, email FROM cad_parceiro ORDER BY id_parceiro ASC;');
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
				}
			});
		}
	});
});

/* GET parceiro edit page (dados jasao). */
router.get('/parceiro/:id_parceiro', function(req, res, next) {
	isLogado(req.headers.token, function(err, valid){
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

		const query = client.query("SELECT * FROM cad_parceiro WHERE cnpj=($1) OR email=($2)",[data.cnpj, data.email], function(err, result){
			done();
			if (result.rowCount > 0) {
				return res.status(409).json({success: false});
			} else {
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
			}
		});
	});
});

//faz login no parceiro
router.put('/login', (req, res, next) => {
	const data = {
		nome_usuario: req.body.nome_usuario,
		senha: req.body.senha
	};
	var parceiroSchema = {
		"nome_usuario": {"type": "string"},
		"senha": {"type": "string"}
  	};

	if(!validate(data, parceiroSchema)){
		return res.status(400).json({success: false, http: 400, mensagem: 'JSON inválido.'});
	} else {
		pg.connect(connectionString, (err, client, done) => {
			if(err) {
				done();
				return res.status(400).json({success: false, http: 400, mensagem: 'Erro na conexão do banco de dados.'});
			}
			const query = client.query("SELECT * FROM cad_parceiro WHERE nome_usuario=($1) AND senha=($2)", [data.nome_usuario, data.senha], function(err, result){
				done();
				if (result.rowCount == 0) {
					return res.status(404).json({success: false, http: 404, mensagem: 'Usuário não encontrado.'});
				} else {
					var token = MD5(data.nome_usuario+'##'+data.senha);
					client.query('UPDATE cad_parceiro SET token=($1), data_adicionado=($2) WHERE nome_usuario=($3)', [token, 'now()', data.nome_usuario], function(err, result){
							done();
							if(err) {
								return res.status(422).json({success: false, http: 422, mensagem: 'Erro na geração do token.'});
							} else {
								return res.json({success: true, http: 200, token: token, mensagem: 'Login realizado com sucesso.'});
							}
						}
					);
				}
			});
		});
	}
});

//faz login no parceiro
router.put('/logout', (req, res, next) => {
	isLogado(req.headers.token, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Usuário não autorizado a deslogar, pois não está logado.'});
		} else {
			pg.connect(connectionString, (err, client, done) => {
				if(err) {
					done();
					return res.status(400).json({success: false, http: 400, mensagem: 'Erro na conexão do banco de dados.'});
				}
				client.query('UPDATE cad_parceiro SET token=($1), data_adicionado=($2) WHERE token=($3)', [null, null, req.headers.token], function(err, result){
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
router.put('/parceiro/:id_parceiro', (req, res, next) => {
	isLogado(req.headers.token, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
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
		}
	});
});

router.delete('/parceiro/:id_parceiro', (req, res, next) => {
	isLogado(req.headers.token, function(err, valid){
		if(!valid){
			return res.status(401).json({success: false, http: 401, mensagem: 'Por favor, faça login novamente e repita o processo.'});
		} else {
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
		}
	});
});

router.post('/verify/login/user/path', (req, res, next)=>{
	const data = {token: req.headers.token};
	var loginSchema = {"token": {"type": "string"}};

	if(!validate(data, loginSchema)){
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

function isLogado (token, callback){
	const login = {token: token};
	var loginSchema = {"token": {"type": "string"}};

  	if(validate(login, loginSchema)){
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

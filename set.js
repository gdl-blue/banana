function beep(cnt) {
    for(var i=1; i<=(cnt || 1); i++)
        prt("");
}

const express = require('express');
const server = express();

server.get('/', (req, res) => res.redirect('/v1/message'));

server.get('/v1/message', (req, res) => {
	res.send(`
		<title>한줄편지 송신기</title>
		<meta charset=utf8 />
		
		<p><strong>이 플랫폼을 통해 개인정보를 전송하면 안됩니다</strong></p>
	
		<form method=post>
			<div>
				<textarea style="width: 100%; height: 300px;" readonly></textarea>
			</div>
			
			<div>
				<label>메시지: </label><br />
				<input type=text style="width: 100%;" name=message placeholde="보낼 메시지" id=messageInput />
				<button type=submit>보내기</button>
			</div>
			
			<div>
				<label>현재 상태: </label><br />
				<input type=text style="width: 100%;" id=statusText readonly value="메시지를 입력하십시오..." />
			</div>
		</form>
		
		<script src="https://code.jquery.com/jquery-1.7.0.js"></script>
		
		<script>
			$(function() {
				$('form').submit(function() {
					$('#statusText').val('수신자로부터 답장 대기 중...');
					$('textarea').val($('textarea').val() + '나: ' + $('#messageInput').val() + '\\n');
					
					$.ajax({
						type: 'POST',
						data: $(this).serialize(),
						dataType: 'json',
						success: function(d) {
							$('#statusText').val('답장을 받았읍니다.');
							$('textarea').val($('textarea').val() + '수신자: ' + d.text + '\\n');
						},
						error: function() {
							$('#statusText').val('메시지를 전송하지 못했읍니다.');
						},
					});
					
					$('#messageInput').val('');
					
					return false;
				});
			});
		</script>
	`);
});

const bodyParser = require('body-parser');

server.use(bodyParser.json({
    limit: '50mb'
}));

server.use(bodyParser.urlencoded({ 
    limit: '50mb',
    extended: false
}));

server.use(express.static('public'));

const readline = require('readline');

server.post('/v1/message', (req, res) => {
	const rl = readline.createInterface(process.stdin, process.stdout);
	rl.question(req.ip + '> ' + req.body['message'] + '\n나> ', msg => {
		rl.close();
		res.json({ text: msg });
	});
});

server.listen(80, '192.168.0.11');

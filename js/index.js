// Kişilik testi

// Bu, kullanıcıya yönlendirilen kişilik sorularının her birinin ayrı ağırlığını hesaplayan bir kod dizisidir.
// Bir kişilik özelliği içe dönük kabul edilirse ağırlığa olumsuz etki edecektir.
// Bir kişilik özelliği dışa dönük kabul edilirse pozitifağırlığı olacaktır.

var prompts = [
{
	prompt: '1) İnsanlarla ilk tanışma evresinde zorluk yaşarım',
	weight: -1,
	class: 'group0'
},
{
	prompt: '2) Bazen derin düşüncelere dalar, çevremdekileri görmezden gelirim',
	weight: -1,
	class: 'group1'
},
{
	prompt: '3) Genelde konuşmaları ben başlatmam',
	weight: -1,
	class: 'group2'
},
{
	prompt: '4) Kızgın veya üzgün görünen insanlarla ilgilenirim',
	weight: 1,
	class: 'group3'
},
{
	prompt: '5) Arkadaşlarımı dikkatli bir şekilde seçerim',
	weight: -1,
	class: 'group4'
},
{
	prompt: '6) Kendimi başkalarına ifade etmekte zorlanmam',
	weight: 1,
	class: 'group5'
},
{
	prompt: '7) Genellikle yüksek motivasyona sahip ve enerjik biriyim',
	weight: 1,
	class: 'group6'
},
{
	prompt: '8) Dinlenme zamanlarında arkadaşlarımla olmak yerine yalnız kalmayı tercih ederim',
	weight: -1,
	class: 'group7'
},
{
	prompt: '9) Düşünme ve araştırmaktan çok hareket isteyen bir işte çalışmayı isterim',
	weight: 1,
	class: 'group8'
},
{
	prompt: '10) Sık sık geçmişi düşünür anılarımı yeniden yaşarım',
	weight: -1,
	class: 'group9'
},
{
	prompt: '11) Kendimi insanlara  kanıtlamak zorunda olduğumu hissetmem',
	weight: 1,
	class: 'group10'
},
{
	prompt: '12) Plan yapmaktan çok doğaçlama yapmayı tercih ederim',
	weight: 1,
	class: 'group11'
}

]

// Bu dizi, olası tüm değerleri ve değerle ilişkili ağırlığı saklar. 

var prompt_values = [
{
	value: 'Kesinlikle katılıyorum', 
	class: 'btn-default btn-kesinlikle-katiliyorum',
	weight: 5
},
{
	value: 'Katılıyorum',
	class: 'btn-default btn-katiliyorum',
	weight: 3,
}, 
{
	value: 'Kısmen katılıyorum', 
	class: 'btn-default',
	weight: 0
},
{
	value: 'Katılmıyorum',
	class: 'btn-default btn-katilmiyorum',
	weight: -3
},
{ 
	value: 'Kesinlikle katılmıyorum',
	class: 'btn-default btn-kesinlikle-katilmiyorum',
	weight: -5
}
]

//  Her komut için, liste grubuna eklenecek bir liste öğesi oluşturulur.
function createPromptItems() {

	for (var i = 0; i < prompts.length; i++) {
		var prompt_li = document.createElement('li');
		var prompt_p = document.createElement('p');
		var prompt_text = document.createTextNode(prompts[i].prompt);

		prompt_li.setAttribute('class', 'list-group-item prompt');
		prompt_p.appendChild(prompt_text);
		prompt_li.appendChild(prompt_p);

		document.getElementById('quiz').appendChild(prompt_li);
	}
}

// For each possible value, create a button for each to be inserted into each li of the quiz
// function createValueButtons() {
	
// 	for (var li_index = 0; li_index < prompts.length; li_index++) {
// 		for (var i = 0; i < prompt_values.length; i++) {
// 			var val_button = document.createElement('button');
// 			var val_text = document.createTextNode(prompt_values[i].value);

// 			val_button.setAttribute('class', 'value-btn btn ' + prompt_values[i].class);
// 			val_button.appendChild(val_text);

// 			document.getElementsByClassName('prompt')[li_index].appendChild(val_button);
// 		}
// 	}
// }
function createValueButtons() {
	for (var li_index = 0; li_index < prompts.length; li_index++) {
		var group = document.createElement('div');
		group.className = 'btn-group btn-group-justified';

		for (var i = 0; i < prompt_values.length; i++) {
			var btn_group = document.createElement('div');
			btn_group.className = 'btn-group';

			var button = document.createElement('button');
			var button_text = document.createTextNode(prompt_values[i].value);
			button.className = 'group' + li_index + ' value-btn btn ' + prompt_values[i].class;
			button.appendChild(button_text);

			btn_group.appendChild(button);
			group.appendChild(btn_group);

			document.getElementsByClassName('prompt')[li_index].appendChild(group);
		}
	}
}

createPromptItems();
createValueButtons();

// Keep a running total of the values they have selected. If the total is negative, the user is introverted. If positive, user is extroverted.
// Calculation will sum all of the answers to the prompts using weight of the value * the weight of the prompt.
var total = 0;

// Get the weight associated to group number
function findPromptWeight(prompts, group) {
	var weight = 0;

	for (var i = 0; i < prompts.length; i++) {
		if (prompts[i].class === group) {
			weight = prompts[i].weight;
		}
	}

	return weight;
}

// Get the weight associated to the value
function findValueWeight(values, value) {
	var weight = 0;

	for (var i = 0; i < values.length; i++) {
		if (values[i].value === value) {
			weight = values[i].weight;
		}
	}

	return weight;
}

// When user clicks a value to agree/disagree with the prompt, display to the user what they selected
$('.value-btn').mousedown(function () {
	var classList = $(this).attr('class');
	// console.log(classList);
	var classArr = classList.split(" ");
	// console.log(classArr);
	var this_group = classArr[0];
	// console.log(this_group);

	// If button is already selected, de-select it when clicked and subtract any previously added values to the total
	// Otherwise, de-select any selected buttons in group and select the one just clicked
	// And subtract deselected weighted value and add the newly selected weighted value to the total
	if($(this).hasClass('active')) {
		$(this).removeClass('active');
		total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
	} else {
		// $('[class='thisgroup).prop('checked', false);
		total -= (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $('.'+this_group+'.active').text()));
		// console.log($('.'+this_group+'.active').text());
		$('.'+this_group).removeClass('active');

		// console.log('group' + findValueWeight(prompt_values, $('.'+this_group).text()));
		// $(this).prop('checked', true);
		$(this).addClass('active');
		total += (findPromptWeight(prompts, this_group) * findValueWeight(prompt_values, $(this).text()));
	}

	console.log(total);
})



$('#submit-btn').click(function () {
	// After clicking submit, add up the totals from answers
	// For each group, find the value that is active
	$('.results').removeClass('hide');
	$('.results').addClass('show');
	
	if(total < 0) {
		// document.getElementById('intro-bar').style.width = ((total / 60) * 100) + '%';
		// console.log(document.getElementById('intro-bar').style.width);
		// document.getElementById('intro-bar').innerHTML= ((total / 60) * 100) + '%';
		document.getElementById('results').innerHTML = '<b>İçe dönüksün!</b><br><br>\
		İnsanlarla takılmak yerine kendi başına bir şeyler yapmayı seviyorsun. Çılgınlar gibi dans edeceğin bir partidense çayını kahveni alıp o çok sevdiğin kitabı okumayı tercih edenlerdensin. Aşırı sesli ve ışıklı ortamlar hiç sana göre değil. Tabii ki içe kapanık olman utanman gerektiği anlamına gelmiyor. Görünen o ki beklenmedik durumlara diğer insanlardan çok daha çabuk uyum sağlıyorsun. Etrafında çok insan olacağına az ve öz arkadaşlarının olması senin için çok önemli. Karşındaki insana güvenmek isterken onların da sana güvenmesini istiyorsun. Bir şey yapmadan önce uzun uzun planlayıp sonra harekete geçiyorsun. Sonuç olarak büyük uğraşlarla inşa ettiğin dünyanda senden mutlusu yok!\
		';
	} else if(total > 0) {
		document.getElementById('results').innerHTML = '<b>Dışa dönüksün!</b><br><br>\
		Bütün enerjin çevrendeki insanlardan geliyor! Sosyal hayatında oldukça heyecanlı, istekli, konuşkan ve eğlencelisin. Arkadaş ortamında ilginin sende olmasını seviyorsun. Yalnız geçirilen anlardan hiç keyif almayan, sürekli birileriyle bir şeyler yapmayı isteyen tipik bir dışa dönüksün. Bu sosyal kişiliğin çalışma hayatında da tabii ki seninle; grup çalışmalarını seviyor ve insanlarla birlikteyken daha yaratıcı olduğunu düşünüyorsun. Yani çok başarılı bir takım lideri olabilirsin. Hayatında bazen yollar ikiye ayrılıyor ve üstünde çok düşünmeden birini seçiveriyorsun. Sonucu ne olursa olsun ‘’Bu benim kararım.’’ diyebilmek hiç de zayıf bir insan olmadığını kanıtlamaya yeter de artar bile. Sonuç olarak bu renkli kişiliğinle hem kendinin hem de etrafındaki insanların neşe kaynağısın!';
	} else {
		document.getElementById('results').innerHTML = '<b>Hem içe dönük hem dışa dönüksün!</b><br><br>\
		İçe dönük müsün yoksa dışa dönük mü bilemedik… Ortalarda bir yerlerdesin işte ikisinden de biraz var, ortaya karışık gibi. Hem keyif aldığın sosyal bir çevren var hem de yalnız yaptığın bazı şeyleri seviyorsun. Yeni insanlarla tanışmak, onlarla vakit geçirmek hoşuna gidiyor. Aynı zamanda kendine de vakit ayırıyorsun. Bir gün kalabalık bir doğum günü partisinde olmak isterken ertesi gün eve kapanıp 10 bölüm dizi izlemek daha cazip gelebiliyor sana. Belli bir ortamda konuşan olmayı da dinleyen olmayı da seviyorsun. İş hayatında da oldukça pozitif bir şey bu. Duruma göre grupla çalışabiliyorken yalnızken de harika işler başarabiliyorsun. Sonuç olarak her türlü ortama uyum sağlayabilen bazen rengarenk bazen negatif tonların insanısın!'
	}


	// Hide the quiz after they submit their results
	$('#quiz').addClass('hide');
	$('#submit-btn').addClass('hide');
	$('#retake-btn').removeClass('hide');
})

// Refresh the screen to show a new quiz if they click the retake quiz button
$('#retake-btn').click(function () {
	$('#quiz').removeClass('hide');
	$('#submit-btn').removeClass('hide');
	$('#retake-btn').addClass('hide');

	$('.results').addClass('hide');
	$('.results').removeClass('show');
})
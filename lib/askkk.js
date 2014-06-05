'use strict';

var nconf = exports.conf = require('nconf');

nconf.file({ file: 'config/askkk-bookkeeper.json' })
  .defaults({
    "firebase": "https://askkkkk-dev.firebaseio.com/",
    "firebase_secret": "etZEKPiPhvkc7kKBoyAQDCe8vEr0ykp5nO5cMlgZ"
  });

var root = exports.root = new (require('firebase'))(nconf.get('firebase'));
root.auth(nconf.get('firebase_secret'), function (error) {
  if (error) {
    console.log(error);
  }
});

var categories = exports.categories = [
  {"group_name":'居住',
    "group_category":['居住','社會住宅','都市更新','土地']},
  {"group_name":'環境',
    "group_category":['環境','國土安全和賑災','自然資源','核能','能源','氣候變化','農業','土地']},
  {"group_name":'人權',
    "group_category":['人權','公民權利和自由','婦女','家庭','性別','移民','消費者保護','刑事司法和執法']},
  {"group_name":'制度改革',
    "group_category":['制度改革','開放政府','創新']},
  {"group_name":'教育',
    "group_category":['教育','科學與技術']},
  {"group_name":'國防／兩岸',
    "group_category":['國防','外交政策','兩岸']},
  {"group_name":'勞工',
    "group_category":['勞工','勞動']},
  {"group_name":'經濟／財稅',
    "group_category":['經濟','創造就業機會','預算和稅收']},
  {"group_name":'社會／醫療',
    "group_category":['社會保障','醫療','身心障礙','老年人照顧','藝術與人文','運動休閒','貧窮']},
  {"group_name":'其他',
    "group_category":['交通運輸','基礎建設','通訊','其他']}
];

var category_groups = exports.category_groups = {
};

categories.forEach(function (group) {
  group.group_category.forEach(function (category) {
    category_groups[category] = group.group_name;
  });
});

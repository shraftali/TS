$(document).ready(function(){
  $('#menu-icon').click(function(){
    $('#page-wrapper').toggleClass('open');
  });
  $('#menu-overlay').click(function(){
    $('#page-wrapper').removeClass('open');
  })
  $('#menu li').has('ul').addClass('parent').prepend('<div class="submenu-toggle"></div>','<div class="submenu-arrow"></div>');
  $('.submenu-toggle').click(function(){
    $(this).toggleClass('on');
    $(this).siblings('ul').toggleClass('submenu-open');
    $(this).siblings('ul').children('li').children('.submenu-toggle').removeClass('on');
    $(this).siblings('ul').children('li').children('ul').removeClass('submenu-open');
  });
  
});
'use strict';

export const compareCheckbox = '.compare input[type=checkbox]';
export const selectedProduct = '.selected-product';
export const selectedProductImg = selectedProduct + ' img';
export const compareButton = '.align-items-center .compare';
export const close = '.close';
export const dataPid = '[data-pid]';
export const buttonGoBack = '.btn-outline-primary';
export const buttonCompare = 'button[type="submit"]';
export const selectorProdToRemove = [selectedProduct + ':nth-child(1)', close].join(' ');
export const selectorProdToRemoveIpad = [selectedProduct + ':nth-child(1)', '.fa-close'].join(' ');

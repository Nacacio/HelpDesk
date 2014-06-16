/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
Ext.define('Helpdesk.store.Reports', {
    extend: 'Helpdesk.store.BasicStore',
    storeId: 'reportsStore',
    fields: [],
    autoLoad: false,
    constructor: function(config) {
        // applyIf means only copy if it doesn't exist
        Ext.applyIf(config, {
            proxy: Ext.create('Helpdesk.proxy.Base', {
                url: 'reports'
            })
        });
        this.callParent([config]);
    },
    getGraphicCategory: function(callbackfunction, user, scope, tickets, dateFrom, dateTo, unit) {
        $.ajax({
            type: 'GET',
            data: {
                tickets: tickets,
                dateFrom: dateFrom,
                dateTo: dateTo,
                unit: unit
            },
            url: 'reports/getgraphiccategory/' + user,
            success: Ext.bind(callbackfunction, scope)});
    },
    getFieldsGraphicCategory: function(callbackfunction, user, scope) {
        $.ajax({
            type: 'GET',
            url: 'reports/getfieldsgraphiccategory/' + user,
            success: Ext.bind(callbackfunction, scope)});
    },
    getFieldsConsolidatedPerMonth: function(callbackfunction, scope) {
        $.ajax({
            type: 'GET',
            url: 'reports/getfieldsconsolidatedpermonth/',
            success: Ext.bind(callbackfunction, scope)});
    },
    getGridConsolidatedPerMonth: function(callbackfunction, period, scope) {
        $.ajax({
            type: 'GET',
            url: 'reports/getgridconsolidatedpermonth',
            data: {
                period: period
            },
            success: Ext.bind(callbackfunction, scope)});
    },
    getGraphicClient: function(callbackfunction, user, scope, tickets, dateFrom, dateTo, unit) {
        $.ajax({
            type: 'GET',
            data: {
                tickets: tickets,
                dateFrom: dateFrom,
                dateTo: dateTo,
                unit: unit
            },
            url: 'reports/getgraphicclient/' + user,
            success: Ext.bind(callbackfunction, scope)});
    },
    getGridConsolidatedPerMonthClient: function(callbackfunction, period, scope) {
        $.ajax({
            type: 'GET',
            url: 'reports/getgridconsolidatedpermonthclient',
            data: {
                period: period
            },
            success: Ext.bind(callbackfunction, scope)});
    },
    getHighlightCurrentCategory: function(callbackfunction, scope) {
        $.ajax({
            type: 'GET',
            url: 'reports/gethighlightcurrentcategory',
            success: Ext.bind(callbackfunction, scope)});
    },
    getHighlightCurrentClient: function(callbackfunction, scope) {
        $.ajax({
            type: 'GET',
            url: 'reports/gethighlightcurrentclient',
            success: Ext.bind(callbackfunction, scope)});
    },
    getGraphicUser: function(callbackfunction, user, scope, idUser, dateFrom, dateTo, unit) {
        $.ajax({
            type: 'GET',
            data: {
                idUser: idUser,
                dateFrom: dateFrom,
                dateTo: dateTo,
                unit: unit
            },
            url: 'reports/getgraphicuser/' + user,
            success: Ext.bind(callbackfunction, scope)});
    },
    getGridConsolidatedPerMonthUser: function(callbackfunction, period, idUser, scope) {
        $.ajax({
            type: 'GET',
            url: 'reports/getgridconsolidatedpermonthuser',
            data: {
                period: period,
                idUser: idUser
            },
            success: Ext.bind(callbackfunction, scope)});
    }
});
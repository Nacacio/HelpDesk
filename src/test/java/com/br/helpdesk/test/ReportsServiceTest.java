/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.br.helpdesk.test;

import com.br.helpdesk.model.GraphicContainer;
import com.br.helpdesk.model.MonthContainer;
import com.br.helpdesk.service.CategoryService;
import com.br.helpdesk.service.ReportsService;
import com.br.helpdesk.service.TicketService;
import com.br.helpdesk.service.UserService;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletResponse;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author Sulivam
 */
public class ReportsServiceTest {
    
//    public ReportsServiceTest() {
//    }
//    
//    @BeforeClass
//    public static void setUpClass() {
//    }
//    
//    @AfterClass
//    public static void tearDownClass() {
//    }
//    
//    @Before
//    public void setUp() {
//    }
//    
//    @After
//    public void tearDown() {
//    }
//
//    /**
//     * Test of setCategoryService method, of class ReportsService.
//     */
//    //@Test
//    public void testSetCategoryService() {
//        System.out.println("setCategoryService");
//        CategoryService categoryService = null;
//        ReportsService instance = new ReportsService();
//        instance.setCategoryService(categoryService);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of setTicketService method, of class ReportsService.
//     */
//    //@Test
//    public void testSetTicketService() {
//        System.out.println("setTicketService");
//        TicketService ticketService = null;
//        ReportsService instance = new ReportsService();
//        instance.setTicketService(ticketService);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of setUserService method, of class ReportsService.
//     */
//   // @Test
//    public void testSetUserService() {
//        System.out.println("setUserService");
//        UserService userService = null;
//        ReportsService instance = new ReportsService();
//        instance.setUserService(userService);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getGraphicCategory method, of class ReportsService.
//     */
//   // @Test
//    public void testGetGraphicCategory() throws Exception {
//        System.out.println("getGraphicCategory");
//        String username = "";
//        String tickets = "";
//        Date dateFrom = null;
//        Date dateTo = null;
//        String unit = "";
//        HttpServletResponse response = null;
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getGraphic(username, tickets, dateFrom, dateTo, unit,true,response);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getJsonGraphicCategory method, of class ReportsService.
//     */
//  //  @Test
//    public void testGetJsonGraphicCategory() {
//        System.out.println("getJsonGraphicCategory");
//        List<GraphicContainer> listGraphicCategoryContainer = null;
//        String unit = "";
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getJsonGraphic(listGraphicCategoryContainer,"", unit);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getJsonGraphicCategoryByUnit method, of class ReportsService.
//     */
//   // @Test
//    public void testGetJsonGraphicCategoryByUnit() {
//        System.out.println("getJsonGraphicCategoryByUnit");
//        List<GraphicContainer> listGraphicCategoryContainer = null;
//        String unit = "";
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getJsonGraphicCategoryByUnit(listGraphicCategoryContainer, unit);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getWeekDay method, of class ReportsService.
//     */
//   // @Test
//    public void testGetWeekDay() {
//        System.out.println("getWeekDay");
//        Calendar cal = null;
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getWeekDay(cal);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getMonth method, of class ReportsService.
//     */
// //   @Test
//    public void testGetMonth() {
//        System.out.println("getMonth");
//        int month = 0;
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getMonth(month);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getFieldsConsolidatedPerMonth method, of class ReportsService.
//     */
//    //@Test
//    public void testGetFieldsConsolidatedPerMonth() {
//        System.out.println("getFieldsConsolidatedPerMonth");
//        HttpServletResponse response = null;
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getFieldsConsolidatedPerMonth(response);
//        //assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of inverseList method, of class ReportsService.
//     */
//  //  @Test
//    public void testInverseList() {
//        System.out.println("inverseList");
//        List<MonthContainer> list = null;
//        ReportsService instance = new ReportsService();
//        List<MonthContainer> expResult = null;
//        List<MonthContainer> result = instance.inverseList(list);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getJsonConsolidatedPerMonth method, of class ReportsService.
//     */
//   // @Test
//    public void testGetJsonConsolidatedPerMonth() {
//        System.out.println("getJsonConsolidatedPerMonth");
//        List<MonthContainer> list = null;
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getJsonConsolidatedPerMonth(list);
//        assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
//
//    /**
//     * Test of getGridConsolidatedPerMonth method, of class ReportsService.
//     */
//    @Test
//    public void testGetGridConsolidatedPerMonth() {
//        System.out.println("getGridConsolidatedPerMonth");
//        String period = "";
//        HttpServletResponse response = null;
//        ReportsService instance = new ReportsService();
//        String expResult = "";
//        String result = instance.getGridConsolidatedPerMonth(period, response);
//        //assertEquals(expResult, result);
//        // TODO review the generated test code and remove the default call to fail.
//        fail("The test case is a prototype.");
//    }
    
}

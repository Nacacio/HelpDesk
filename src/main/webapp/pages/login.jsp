<%@page contentType="text/html; charset=UTF-8" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="s" uri="http://www.springframework.org/tags"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<input type="hidden" name="user" id="user" value="<%=request.getAttribute("user")%>">
<input type="hidden" name="logged" id="logged" value="<%=request.getAttribute("logged")%>">
<input type="hidden" name="client" id="client" value="<%=request.getAttribute("client")%>">
<input type="hidden" name="email" id="client" value="<%=request.getAttribute("email")%>">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <script type="text/javascript">
            var homeURL = '${ctx}';
        </script>
        <!-- Framework -->
        <script src="<s:url value="/extjs"/>/ext-all-dev.js"></script>
        <!-- Locales -->
        <script charset="UTF-8" src="<s:url value="/app"/>/locale/locale.js"></script>
        <!-- CSS -->
        <link href="<s:url value="/extjs" />/resources/css/ext-all-gray.css" rel="stylesheet" type="text/css" />
        <link href="<s:url value="/resources" />/css/main.css" rel="stylesheet" type="text/css" />
        <link href="<s:url value="/resources" />/css/images.css" rel="stylesheet" type="text/css" />

        <script src="<s:url value="/app"/>/login.js"></script>
    </head>
    <body>
    </body>
</html>
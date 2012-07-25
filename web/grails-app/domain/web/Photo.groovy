package web

class Photo {

    static constraints = {
        // Limit upload file size to 1MB
        data maxSize: 1024 * 1024 * 1 // TODO michal bernhard: fluent interface like http://wicket.apache.org/apidocs/1.4/org/apache/wicket/util/lang/Bytes.html
    }

    byte[] data

}
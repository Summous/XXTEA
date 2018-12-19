(function() {
    function long2str(v, w) {
        var vl = v.length;
        var sl = v[vl - 1] & 0xffffffff;
        for (var i = 0; i < vl; i++)
        {
            v[i] = String.fromCharCode(v[i] & 0xff,
                                    v[i] >>> 8 & 0xff,
                                    v[i] >>> 16 & 0xff, 
                                    v[i] >>> 24 & 0xff);
        }
        if (w) {
            return v.join('').substring(0, sl);
        }
        else {
            return v.join('');
        }
    }
    
    function str2long(s, w) {
        var len = s.length;
        var v = [];
        for (var i = 0; i < len; i += 4)
        {
            v[i >> 2] = s.charCodeAt(i)
                    | s.charCodeAt(i + 1) << 8
                    | s.charCodeAt(i + 2) << 16
                    | s.charCodeAt(i + 3) << 24;
        }
        if (w) {
            v[v.length] = len;
        }
        return v;
    }
    
    function xxtea_encrypt(str, key) {
        if (str == "") {
            return "";
        }
        var v = str2long(str, true);
        var k = str2long(key, false);
        var n = v.length - 1;
    
        var z = v[n], y = v[0], delta = 0x9E3779B9;
        var mx, e, q = Math.floor(6 + 52 / (n + 1)), sum = 0;
        while (q-- > 0) {
            sum = sum + delta & 0xffffffff;
            e = sum >>> 2 & 3;
            for (var p = 0; p < n; p++) {
                y = v[p + 1];
                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                z = v[p] = v[p] + mx & 0xffffffff;
            }
            y = v[0];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            z = v[n] = v[n] + mx & 0xffffffff;
        }
    
        return str2Hex(long2str(v, false));
    }
    
    function xxtea_decrypt(str, key) {
        if (str == "") {
            return "";
        }
    
        str=hex2str(str);
        var v = str2long(str, false);
        var k = str2long(key, false);
        var n = v.length - 1;
    
        var z = v[n - 1], y = v[0], delta = 0x9E3779B9;
        var mx, e, q = Math.floor(6 + 52 / (n + 1)), sum = q * delta & 0xffffffff;
        while (sum != 0) {
            e = sum >>> 2 & 3;
            for (var p = n; p > 0; p--) {
                z = v[p - 1];
                mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
                y = v[p] = v[p] - mx & 0xffffffff;
            }
            z = v[n];
            mx = (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[p & 3 ^ e] ^ z);
            y = v[0] = v[0] - mx & 0xffffffff;
            sum = sum - delta & 0xffffffff;
        }
    
        return long2str(v, true);
    }
    
    function str2Hex(input) { 
        var output = ""; 
        var chr1 = ""; 
        var i = 0;
        do { 
            chr1 = input.charCodeAt(i++).toString(16); 
        if(chr1.length==1)chr1="0"+chr1;
        output+=chr1;
        } while (i < input.length);
        return output; 
    }
    
    function hex2str(input) {
        var output="";
        var i=0;
        while(i<input.length){
            var k = parseInt(input.substr(i,1),16)<<4 | parseInt(input.substr(++i,1),16);
            k=k&255;
            output+=String.fromCharCode(k);
            ++i;
        }
        return output;
    }
    
    //base64_encodeAndDecode
    function Base64() {
    }
    Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; 
    Base64.encode64 = function (input) { 
        var output = ""; 
        var chr1, chr2, chr3 = ""; 
        var enc1, enc2, enc3, enc4 = ""; 
        var i = 0;
        do { 
            chr1 = input.charCodeAt(i++); 
            chr2 = input.charCodeAt(i++); 
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2; 
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); 
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6); 
            enc4 = chr3 & 63;
            if (isNaN(chr2)) { 
                enc3 = enc4 = 64; 
            } else if (isNaN(chr3)) { 
                enc4 = 64; 
            }
            output = output + 
            Base64._keyStr.charAt(enc1) + 
            Base64._keyStr.charAt(enc2) + 
            Base64._keyStr.charAt(enc3) + 
            Base64._keyStr.charAt(enc4); 
            chr1 = chr2 = chr3 = ""; 
            enc1 = enc2 = enc3 = enc4 = ""; 
        } while (i < input.length);
        return output; 
    }
    
    Base64.decode64 = function (input) { 
        var output = ""; 
        var chr1, chr2, chr3 = ""; 
        var enc1, enc2, enc3, enc4 = ""; 
        var i = 0;
        var base64test = /[^A-Za-z0-9\+\/\=\n]/g; 
        if (base64test.exec(input)) { 
            return "error";
        } 
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do { 
            enc1 = Base64._keyStr.indexOf(input.charAt(i++)); 
            enc2 = Base64._keyStr.indexOf(input.charAt(i++)); 
            enc3 = Base64._keyStr.indexOf(input.charAt(i++)); 
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4); 
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); 
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) { 
                output = output + String.fromCharCode(chr2); 
            } 
            if (enc4 != 64) { 
                output = output + String.fromCharCode(chr3); 
            }
            chr1 = chr2 = chr3 = ""; 
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);
        return output; 
    }

    module.exports.XXTEA = {
        xxtea_decrypt: xxtea_decrypt,
        xxtea_encrypt: xxtea_encrypt,
        encode64: Base64.encode64,
        decode64: Base64.decode64
    };
})()

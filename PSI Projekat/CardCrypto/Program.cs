using Chrome4Net.NativeMessaging;
using log4net;
using Microsoft.Win32;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;

namespace CardCrypto
{
    class NativeHost
    {
        private static ILog log = null;
        static void Main(string[] args)
        {
            log4net.Config.XmlConfigurator.Configure();
            log = LogManager.GetLogger(typeof(NativeHost));
            runNativeHost();
        }
        private static void runNativeHost()
        {
            Port port = new Port();
            log.Info("Running native");
            while (true)
            {
                try
                {
                    string message = port.Read();
                    if(message.Length>200)
                    {
                        log.Info("Got message: "+message.Substring(0,200)+"...");
                    }
                    else
                    {
                        log.Info("Got message: " + message);
                    }
                    JObject request = JObject.Parse(message);
                    JObject reply = new JObject();
                    try
                    {
                        if (request.ContainsKey("type"))
                        {
                            string type = request["type"].ToObject<String>();
                            if (type == "encrypt")
                            {
                                encrypt(request, reply);
                            }
                            else if (type == "decrypt")
                            {
                                decrypt(request, reply);
                            }
                            else if (type == "export")
                            {
                                export(request, reply);
                            }
                            else if (type == "sign")
                            {
                                sign(request, reply);
                            }
                            else if (type == "verify")
                            {
                                verify(request, reply);
                            }
                            else if (type == "echo")
                            {
                                reply["type"] = "echo";
                                reply["status"] = "OK";
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        reply["status"] = "EXC";
                        reply["message"] = ex.Message;
                        reply["strace"] = ex.StackTrace;
                    }
                    reply["source"] = request["destination"];
                    reply["destination"] = request["source"];
                    reply["extension"] = "brzeboljejeftinije.messenger.cardreader";
                    request.Remove("payload");
                    reply["request"] = request;
                    message = reply.ToString(Formatting.None);
                    port.Write(message);
                }
                catch(EndOfInputStreamException)
                {
                    return;
                }
            }
        }
        private static void encrypt(JObject request, JObject reply)
        {
            string payload = request["payload"].ToObject<String>();
            RSACryptoServiceProvider provider = null;
            if (request.ContainsKey("cert"))
            {
                var cert = request["cert"].ToObject<String>();
                provider = (RSACryptoServiceProvider)CryptoHelper.LoadCert(cert).PublicKey.Key;
            }
            else
            {
                provider = CryptoHelper.GetProvider(false);
            }
            if (provider != null)
            {
                var data = Convert.FromBase64String(payload);
                var ciphertext = provider.Encrypt(data, false);
                reply["payload"] = Convert.ToBase64String(ciphertext);
                reply["status"] = "OK";
            }
            else
            {
                reply["status"] = "NO_CARD";
            }
        }
        private static void decrypt(JObject request, JObject reply)
        {
            if (CryptoHelper.CardPresentAndCertValid())
            {
                string payload = request["payload"].ToObject<String>();
                var provider = CryptoHelper.GetProvider(false);
                var ciphertext = Convert.FromBase64String(payload);
                var plaintext = provider.Decrypt(ciphertext, false);
                reply["payload"] = Convert.ToBase64String(plaintext);
                reply["status"] = "OK";
            }
            else
            {
                reply["status"] = "NO_CARD";
            }
        }
        private static void sign(JObject request, JObject reply)
        {
            if (CryptoHelper.CardPresentAndCertValid())
            {
                string payload = request["payload"].ToObject<String>();
                var provider = CryptoHelper.GetProvider(false);
                var data = Convert.FromBase64String(payload);
                var signature = provider.SignData(data, CryptoConfig.MapNameToOID("SHA256"));
                reply["payload"] = Convert.ToBase64String(signature);
                log.Info("Signature: " + Convert.ToBase64String(signature));
                reply["status"] = "OK";
            }
            else
            {
                reply["status"] = "NO_CARD";
            }
        }
        private static void verify(JObject request, JObject reply)
        {
            string payload = request["payload"].ToObject<String>();
            byte[] signature = Convert.FromBase64String(request["signature"].ToObject<String>());
            RSACryptoServiceProvider provider = null;
            if (request.ContainsKey("cert"))
            {
                var cert = request["cert"].ToObject<String>();
                provider = (RSACryptoServiceProvider)CryptoHelper.LoadCert(cert).PublicKey.Key;
            }
            else
            {
                provider = CryptoHelper.GetProvider(false);
            }
            if (provider != null)
            {
                var data = Convert.FromBase64String(payload);
                bool result = provider.VerifyData(data, CryptoConfig.MapNameToOID("SHA256"), signature);
                reply["payload"] = result.ToString();
                reply["status"] = "OK";
            }
            else
            {
                reply["status"] = "NO_CARD";
            }
        }
        private static void export(JObject request, JObject reply)
        {
            string certificate = CryptoHelper.GetCertificate();
            if (certificate != null)
            {
                reply["payload"] = certificate;
                reply["status"] = "OK";
            }
            else
            {
                reply["status"] = "NO_CARD";
            }
        }
    }
}

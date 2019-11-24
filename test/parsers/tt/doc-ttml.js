const test = require('tape')
const { parse } = require('../../../dist/parsers/tt');
const { TagType } = require('../../../dist/types');

const SAMPLE = `<?xml version="1.0" encoding="UTF-8"?>
<tt xmlns="http://www.w3.org/ns/ttml" xmlns:tts="http://www.w3.org/ns/ttml#styling" xmlns:ttm="http://www.w3.org/ns/ttml#metadata" xmlns:ttp="http://www.w3.org/ns/ttml#parameter" ttp:timeBase="media" ttp:cellResolution="32 15" xml:lang="en-GB">
    <head>
        <metadata>
            <ttm:copyright>Potato Corp</ttm:copyright>
        </metadata>
        <styling>
            <style xml:id="S0" tts:fontSize="100%" tts:textAlign="center" tts:lineHeight="120%" ebutts:linePadding="0.5c" tts:fontFamily="Reith-sans,proportionalSansSerif"></style>
            <style xml:id="S1" tts:textAlign="left"></style>
            <style xml:id="S2" tts:color="#FFFFFF" tts:backgroundColor="#000000"></style>
            <style xml:id="S3" tts:color="#00FFFF" tts:backgroundColor="#000000"></style>
            <style xml:id="S4" tts:color="#FFFF00" tts:backgroundColor="#000000"></style>
        </styling>
        <layout>
            <region xml:id="R1" tts:origin="14.375% 79.348%" tts:extent="71.250% 15.652%" tts:displayAlign="after"></region>
            <region xml:id="R2" tts:origin="14.375% 87.174%" tts:extent="71.250% 7.826%" tts:displayAlign="after"></region>
            <region xml:id="R3" tts:origin="14.375% 83.261%" tts:extent="71.250% 7.826%" tts:displayAlign="after"></region>
        </layout>
    </head>
    <body ttm:role="caption">
        <div style="S0">
            <p xml:id="C1" begin="00:00:02.200" end="00:00:07.520" region="R1"><span style="S2">I are you</span><br/><span style="S2">potato monday.</span></p>
            <p xml:id="C2" begin="00:00:07.520" end="00:00:10.040" region="R1"><span style="S3">Orange shouldn&#39;t change</span><br/><span style="S3">juice me.</span></p>
            <p xml:id="C3" begin="00:00:10.040" end="00:00:13.240" region="R2"><span style="S4">He&#39;s a pancake.</span></p>
        </div>
    </body>
</tt>`;

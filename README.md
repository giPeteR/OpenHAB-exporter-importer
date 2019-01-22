# OpenHAB-exporter-importer
The text below is copied from the self explanatory script:
-------------------------------------------------------------------

OpenHAB REST Exporter/Importer for Items and Links
<div>
These files will allow you to make <b>all</b> your <i>items</i> editable (RW) in a couple of minutes. It doesn't matter if <i>items</i> are created in <a href="/paperui/" target="_blank">PaperUI</a>, <a href="/habmin/" target="_blank">HabMIN</a>, <i>.items</i>-files. <b>All</b> <i>items</i> will be inserted into the OpenHAB <b>JSON dB</b> and editable through <b>PaperUI</b>.<br>

The main purpouse is adding <a href="https://www.openhab.org/docs/ecosystem/google-assistant/#google-assistant-action" target="_blank"><i>tags</i></a> enabling <a href="https://community.openhab.org/t/howto-listen-talk-to-your-home" target="_blank">Google Home</a> (and likely <a href="https://community.openhab.org/t/solved-easy-way-to-link-alexa-to-openhab" target="_blank">Alexa</a>?).<br>
</div>
<div>This is for RaspberryPi, OpenHab 2 (snapshot), SSH. It probably works for most platforms as long as you can SSH.<br>
I'm using OH2 <a href="https://www.openhab.org/docs/installation/linux.html#file-locations" target="_blank">aliases</a> mapped to <i>/srv/</i> instead of hard paths, which makes it less platform dependent.<br><br>
</div>
<div>
The boring stuff: <b>"Use it at your own risk!"</b> I have +200 <i>items</i> and used this method 20 times now, rebooted plenty, tested again... but it may behave differently at your system.<br><br>
</div>

<b>Installation:</b>
Download .7z and extract to /srv/openhab2-conf/html
Careful if you already have an index.html
The script does not change anything in OH and cannot break anything. The magic happens when you import the data again.

<a href="https://community.openhab.org/t/howto-move-all-items-to-json-db-for-easy-editing-in-paperui-and-tagging-for-google-home-and-alexa" target="_blank">HowTo: Move ALL items to JSON dB for easy editing in PaperUI and tagging for Google Home (and Alexa)</a>

Best Regards<br>
Pete<i>R</i>

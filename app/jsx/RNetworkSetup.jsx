/**
 * @date 8/11/15 12:51 PM
 */
var RNetworkSetup = React.createClass({
    render: function () {
        return (
            <div className="dialog-container">
                    <div className="dialog-wrapper">
                        <div className="dialog-content">
                            <div className="border">
                                <div className="caption"><h3>{__('Network Setup')}</h3></div>
                                <div className="content">
                                    {this.props.children}
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

















































/*
                <!--
                    <NetworkSetupChooseConnectionType />
                    <NetworkSetupApplySettings />
                    <NetworkSetupMessage text='Applying network settings...' />
                    <NetworkSetupCheckingConnection />
                    <NetworkSetupSpecifySettings />
                    <NetworkSetupSpecifySettingsManually />
                    <NetworkSetupMessageBox text="Message box text" />
                    <NetworkSetupChooseWiFiNetwork />
                    <NetworkSetupChooseWiFiSecurityType />
                    <NetworkSetupEnterWiFiPassword />
                -->


                <!-- Network Setup: Please choose network connection type -->
                <div class="dialog-content" style="display: none">
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Please choose network connection type.</p>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>Wired (Ethernet)</li>
                                    <li>Wireless (WiFi)</li>
                                    <li>None</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: The following settings will be applied -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>
                                The following settings will be applied <br/>
                                Connection type: Wired (Ethernet)
                            </p>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>OK (Automatic Setup)</li>
                                    <li>Manual Setup</li>
                                    <li>Back</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Applaying network settings -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Applying network settings...</p>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Checking network connection. -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Checking network connection.</p>
                            <div class="definition-list-container">
                                <dl>
                                    <dt>Checking local network...</dt>
                                    <dd>OK (IP address 172.18.4.178)</dd>

                                    <dt>Checking Internet...</dt>
                                    <dd>OK</dd>

                                    <dt>Time synchronization...</dt>
                                    <dd>OK</dd>
                                </dl>
                            </div>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>OK</li>
                                    <li>Back</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: What TCP/IP settings do you want to specify manually: -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>What TCP/IP settings do you want to specify manually:</p>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>All TCP/IP Settings</li>
                                    <li>DNS Settings</li>
                                    <li>Back</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: TCP/IP Settings -->
                <div class="dialog-content" style='display: block'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content form">
                            <p class='text'>TCP/IP Settings</p>
                            <div class="definition-list-container inactive">
                                <dl>
                                    <dt>IP address: </dt><dd><div class="input"><p>172.18.3.159</div></dd>
                                    <dt>Network mask: </dt><dd><div class="input selected"><p>255.255.255.0</div></dd>
                                    <dt>Gateway: </dt><dd><div class="input"><p>172.18.3.159</div></dd>
                                    <dt>DNS server 1: </dt><dd><div class="input"><p>172.18.3.159</div></dd>
                                    <dt>DNS server 2: </dt><dd><div class="input"><p>172.18.3.159</div></dd>
                                </dl>
                            </div>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>OK</li>
                                    <li>Back</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Wi-Fi hardware not found. -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Wi-Fi hardware not found.</p>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>OK</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Scanning for Wi-Fi networks... -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Scanning for Wi-Fi networks...</p>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Scan for Wi-Fi networks failed. -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Scan for Wi-Fi networks failed.</p>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>OK</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Choose Wi-Fi Network -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Choose Wi-Fi Network</p>
                            <div class="list-container">
                                <ul>
                                    <li class='selected'>Dune IT</li>
                                    <li>Dune-Office</li>
                                    <li>Dune-Setvice</li>
                                    <li>Dune-Guests</li>
                                    <li>3SGuest</li>
                                    <li>guest-1</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Please choose Wi-Fi network security type: -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Please choose Wi-Fi network security type:</p>
                            <div class="list-container">
                                <ul>
                                    <li>None</li>
                                    <li>WEP 64-bit (ASCII)</li>
                                    <li class='selected'>WEP 64-bit (HEX)</li>
                                    <li>WEP 128-bit (ASCII)</li>
                                    <li>WEP 128-bit (HEX)</li>
                                    <!--<li>WPA TKIP</li>
                                    <li>WPA AES</li>
                                    <li>WPA2 TKIP</li>
                                    <li>WPA2 AES</li>-->
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Network Setup: Please enter Wi-Fi network password: -->
                <div class="dialog-content" style='display: none'>
                    <div class="border">
                        <div class="caption"><h3>Network Setup</h3></div>
                        <div class="content">
                            <p class='text'>Please enter Wi-Fi network password: </p>
                            <div class='form-container'>
                                <div class='form-wrapper'>
                                    <div class='input'><p>Password</p></div>
                                </div>
                            </div>
                            <div class="list-container">
                                <ul>
                                    <li>OK</li>
                                    <li>Back</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

*/
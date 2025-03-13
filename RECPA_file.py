import wx
import wx.html2
import subprocess
import os
import time
import sys
import shutil

class MyBrowser(wx.Frame):
    def __init__(self, *args, **kwds):
        wx.Frame.__init__(self, *args, **kwds)
        self.browser = wx.html2.WebView.New(self)
        self.browser.LoadURL("http://localhost:5173/")
        self.Show()

class MyApp(wx.App):
    def OnInit(self):
        project_dir = os.path.join(os.path.dirname(__file__), 'MAP')

        # Start the npm process
        try:
            npm_path = r"C:\Program Files\nodejs\npm.cmd"
            self.process = subprocess.Popen([npm_path, 'start'], cwd=project_dir)
            time.sleep(5)
        except Exception as e:
            wx.MessageBox(f"Failed to start npm: {e}", "Error", wx.OK | wx.ICON_ERROR)
            return False

        frame = MyBrowser(None, -1)
        frame.SetTitle("Power Charge Analysis")
        frame.Show(True)
        return True

app = MyApp(0)
app.MainLoop()
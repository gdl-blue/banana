VERSION 5.00
Begin VB.Form frmPlayer 
   Caption         =   "BEEP"
   ClientHeight    =   3015
   ClientLeft      =   135
   ClientTop       =   450
   ClientWidth     =   4530
   Icon            =   "frmPlayer.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   3015
   ScaleWidth      =   4530
   StartUpPosition =   3  'Windows 기본값
End
Attribute VB_Name = "frmPlayer"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Private Declare Function BEEP Lib "kernel32" Alias "Beep" (ByVal dwFreq As Long, ByVal dwDuration As Long) As Long
Private Declare Sub Sleep Lib "kernel32" (ByVal dwMilliseconds As Long)

Dim args

' VBForums에서 퍼옴.
' 제작자: (Milk (Sleep+Pause Sub)). (Wayne Spangler (Pause Sub))
Sub Pause(ByVal Delay As Single)
   Delay = Timer + Delay
   If Delay > 86400 Then 'more than number of seconds in a day
      Delay = Delay - 86400
      Do
          DoEvents ' to process events.
          Sleep 1 ' to not eat cpu
      Loop Until Timer < 1
   End If
   Do
       DoEvents ' to process events.
       Sleep 1 ' to not eat cpu
   Loop While Delay > Timer
End Sub

Private Sub Form_Load()
    Me.Hide
    On Error Resume Next
    args = Split(Command, " ")
    Dim prop As Variant
    For Each prop In Split(Command, " ")
        If CStr(Split(prop, ",")(0)) = "0" Then
            Pause CInt(Split(prop, ",")(1)) / 1000
        Else
            BEEP Split(prop, ",")(0), Split(prop, ",")(1)
        End If
    Next
    End
End Sub

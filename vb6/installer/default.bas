Attribute VB_Name = "default"
'https://stackoverflow.com/questions/15960295/playing-windows-system-sounds-from-vb6
Public Declare Function MessageBeep Lib "user32" (ByVal wType As Long) As Long
Public Const MB_BEEP As Long = -1   ' the default beep sound
Public Const MB_ERROR As Long = 16        ' for critical errors/problems
Public Const MB_WARNING As Long = 48      ' for conditions that might cause problems in the future
Public Const MB_INFORMATION As Long = 64  ' for informative messages only
Public Const MB_QUESTION As Long = 32     ' (no longer recommended to be used)

Public MSGRS As Boolean

'http://www.devpia.com/MAEUL/Contents/Detail.aspx?BoardID=48&MAEULNo=19&no=2034&ref=1001
Public Function LenH(ByVal strValue As String) As Integer
    LenH = LenB(StrConv(strValue, vbFromUnicode))
End Function

Sub Alert(Content As String, Title As String, Optional OwnerForm As Form = 1, Optional Icon As Long = 64) 'Windows Vista 이상 윈도우에서 Windws 2000 스타일 메시지 상자 표시
    On Error Resume Next
    
    Select Case Icon
        Case 48
            msgXPMB.imgMBIconWarning.Visible = True
        Case 16
            msgXPMB.imgMBIconError.Visible = True
        Case 64
            msgXPMB.imgMBIconInfo.Visible = True
    End Select
    
    MessageBeep Icon
    
    Dim i As Integer
    Dim LineCount As Integer
    Dim LContent As Integer
    LContent = 0
    LineCount = 1
    For i = 1 To Len(Content)
        If Mid$(Content, i, Len(vbCrLf)) = vbCrLf Then LineCount = LineCount + 1
    Next i
    
    Dim S As Integer
    For S = 1 To UBound(Split(Content, vbCrLf))
        If LenH(Split(Content, vbCrLf)(S)) > LContent Then LContent = LenH(Split(Content, vbCrLf)(S))
    Next S
    
    If LContent = 0 Then LContent = LenH(Content)
    
    LineCount = LineCount + 1
    msgXPMB.lblContent.Height = 240 * LineCount
    msgXPMB.Height = 1575 + LineCount * 240 - 300 + 50
    msgXPMB.Caption = Title
    msgXPMB.lblContent.Caption = Content
    msgXPMB.Width = 2040 + (LContent * 85)
    msgXPMB.cmdOK.Left = msgXPMB.Width / 2 - 810
    msgXPMB.cmdOK.Top = 840 + ((LineCount - 1) * 240) - 200
    msgXPMB.BeepSnd = Icon
    msgXPMB.Show vbModal, OwnerForm
End Sub


Function Confirm(Content As String, Title As String, Optional OwnerForm As Form = 1, Optional Icon As Long = 32, Optional BtnReversed As Boolean = False) As Boolean 'Windows Vista 이상 윈도우에서 Windws 2000 스타일 메시지 상자 표시
    Select Case Icon
        Case 48
            msgXPOC.imgMBIconWarning.Visible = True
        Case 16
            msgXPOC.imgMBIconError.Visible = True
        Case 64
            msgXPOC.imgMBIconInfo.Visible = True
        Case 32
            msgXPOC.imgMBIconQuestion.Visible = True
    End Select
    
    MessageBeep Icon
    
    Dim i As Integer
    Dim LineCount As Integer
    Dim LContent As Integer
    LContent = 0
    LineCount = 1
    For i = 1 To Len(Content)
        If Mid$(Content, i, Len(vbCrLf)) = vbCrLf Then LineCount = LineCount + 1
    Next i
    
    Dim S As Integer
    For S = 1 To UBound(Split(Content, vbCrLf))
        If LenH(Split(Content, vbCrLf)(S)) > LContent Then LContent = LenH(Split(Content, vbCrLf)(S))
    Next S
    
    If LContent = 0 Then LContent = LenH(Content)
    
    LineCount = LineCount + 1
    msgXPOC.lblContent.Height = 240 * LineCount
    msgXPOC.Height = 1575 + LineCount * 240 - 300 + 50
    msgXPOC.Caption = Title
    msgXPOC.lblContent.Caption = Content
    msgXPOC.Width = 2040 + (LContent * 85)
    msgXPOC.cmdOK.Left = msgXPOC.Width / 2 - 810 - msgXPOC.cmdOK.Width / 2
    msgXPOC.cmdOK.Top = 840 + ((LineCount - 1) * 240) - 200
    msgXPOC.cmdCancel.Left = msgXPOC.Width / 2 - 810 - msgXPOC.cmdOK.Width / 2 - 120 + msgXPOC.cmdOK.Width + 240
    msgXPOC.cmdCancel.Top = 840 + ((LineCount - 1) * 240) - 200
    msgXPOC.BeepSnd = Icon
    
    If BtnReversed = True Then
        Dim LB As Integer
        LB = msgXPOC.cmdOK.Left
        Dim RB As Integer
        RB = msgXPOC.cmdCancel.Left
        
        msgXPOC.cmdCancel.Left = LB
        msgXPOC.cmdOK.Left = RB
    End If
    
    msgXPOC.Show vbModal, OwnerForm
    
    Confirm = MSGRS
End Function
